import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

import { findUserByEmail, createUser } from '@/lib/users'

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

    // Create user
    const user = await createUser({
      email,
      passwordHash: hashedPassword,
      name: `${firstName} ${lastName}`.trim(),
    })

    // Return success response
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,  
          role: user.role,  
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
