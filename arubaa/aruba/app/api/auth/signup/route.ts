import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { rateLimit } from '@/lib/rate-limit'

import { findUserByEmail, createUser, updateUser } from '@/lib/users'
import { sendVerificationEmail } from '@/lib/email'

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

// Input validation schema
const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    console.log('Signup request received')
    
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
      console.log('Request body:', JSON.stringify({ ...body, password: '[REDACTED]' }, null, 2))
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Validate input
    const result = signupSchema.safeParse(body)
    if (!result.success) {
      console.error('Validation error:', result.error)
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, password, userType } = result.data

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date()
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24) // 24 hours expiry

    // Create user
    const user = await createUser({
      email,
      passwordHash: hashedPassword,
      name: `${firstName} ${lastName}`.trim(),
    })

    // Update user with verification token
    await updateUser(user.id, {
      verificationToken,
      verificationTokenExpires,
    })

    // Send verification email
    let emailSent = false
    let emailError = null
    try {
      console.log('Attempting to send verification email...')
      await sendVerificationEmail({
        email: user.email,
        name: user.name || firstName,
        verificationToken,
      })
      emailSent = true
      console.log('✓ Verification email sent successfully to:', user.email)
    } catch (err) {
      emailError = err
      console.error('✗ Error sending verification email:', err)
      // Continue even if email fails - user is still created
      // Log the error but don't fail the signup
      // The user can request a new verification email later if needed
    }

    // Check environment variables for debugging
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠ WARNING: RESEND_API_KEY is not set in environment variables')
      console.warn('⚠ Email sending is disabled. Please add RESEND_API_KEY to .env.local')
    }

    // Return success response with email status
    return NextResponse.json(
      { 
        message: emailSent 
          ? 'User created successfully. Please check your email to verify your account.'
          : 'User created successfully. However, we could not send the verification email. Please check your email configuration.',
        emailSent,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,  
          role: user.role,  
        },
        ...(process.env.NODE_ENV === 'development' && emailError && {
          emailError: emailError instanceof Error ? emailError.message : 'Unknown error'
        })
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup'
    
    // Don't expose internal error details in production
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? errorMessage 
          : 'An error occurred during signup. Please try again later.' 
      },
      { status: 500 }
    )
  }
}
