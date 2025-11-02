import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { SignJWT } from 'jose'
import { findUserByEmail, updateUser } from '@/lib/users'

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

// Input validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
})

const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds
const SESSION_COOKIE = 'session_token'

export async function POST(req: Request) {
  try {
    console.log('Login request received')
    
    // Check for SESSION_SECRET environment variable
    const SESSION_SECRET = process.env.SESSION_SECRET
    if (!SESSION_SECRET) {
      console.error('SESSION_SECRET environment variable is not set')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    
    // Rate limiting
    const identifier = req.headers.get('x-forwarded-for') || 'unknown'
    const isRateLimited = await limiter.check(5, identifier)

    if (isRateLimited) {
      console.log('Rate limit exceeded for:', identifier)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await req.json()
      console.log('Request body:', JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { email, password, rememberMe } = validation.data

    // Normalize email for lookup
    const normalizedEmail = email.toLowerCase().trim()
    
    // Find user by email
    const user = await findUserByEmail(normalizedEmail)
    
    console.log('Login attempt for email:', normalizedEmail)
    console.log('User found:', user ? { id: user.id, email: user.email } : 'null')

    // Prevent timing attacks by using bcrypt compare even if user doesn't exist
    const passwordMatch = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.compare(password, '$2a$10$dummyhash')
    
    console.log('Password match:', passwordMatch)

    // Check if account is locked
    const now = new Date()
    if (user?.accountLockedUntil) {
      const lockUntil = user.accountLockedUntil instanceof Date 
        ? user.accountLockedUntil 
        : new Date(user.accountLockedUntil)
      
      if (now < lockUntil) {
        return NextResponse.json(
          { error: 'Account is temporarily locked. Please try again later.' },
          { status: 403 }
        )
      }
    }

    // Handle failed login
    if (!user || !passwordMatch) {
      // Update failed login attempts
      if (user) {
        const failedAttempts = (user.failedLoginAttempts || 0) + 1
        const maxAttempts = 5
        const lockoutMinutes = 15
        
        await updateUser(user.id, {
          failedLoginAttempts: failedAttempts,
          lastFailedLoginAttempt: now,
          accountLockedUntil: failedAttempts >= maxAttempts 
            ? new Date(now.getTime() + lockoutMinutes * 60 * 1000)
            : null,
        })

        if (failedAttempts >= maxAttempts) {
          return NextResponse.json(
            { error: `Too many failed attempts. Account locked for ${lockoutMinutes} minutes.` },
            { status: 403 }
          )
        }
      }

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts > 0) {
      await updateUser(user.id, { 
        failedLoginAttempts: 0,
        lastFailedLoginAttempt: null,
        accountLockedUntil: null,
      })
    }

    // Create JWT token
    const secret = new TextEncoder().encode(SESSION_SECRET)
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(rememberMe ? '30d' : '1d')
      .sign(secret)

    // Create response and set cookie
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    )

    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: rememberMe ? SESSION_MAX_AGE : 60 * 60 * 24, // 1 day if not remember me
    })

    return response

  } catch (error) {
    console.error('Login error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Error',
    });

    return NextResponse.json(
      { 
        error: 'An unexpected error occurred', 
        details: process.env.NODE_ENV === 'development' && error instanceof Error 
          ? error.message 
          : undefined,
      },
      { status: 500 }
    );
  }
}
