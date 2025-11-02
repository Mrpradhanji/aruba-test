import { NextResponse } from 'next/server'
import { z } from 'zod'
import { findUserByVerificationToken, updateUser } from '@/lib/users'

// Input validation schema
const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Validate token format
    const validation = verifyEmailSchema.safeParse({ token })
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid verification token format' },
        { status: 400 }
      )
    }

    // Find user by verification token
    const user = await findUserByVerificationToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new verification email.' },
        { status: 400 }
      )
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email has already been verified' },
        { status: 200 }
      )
    }

    // Update user to mark email as verified and clear verification token
    await updateUser(user.id, {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    })

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during email verification' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate request body
    const validation = verifyEmailSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { token } = validation.data

    // Find user by verification token
    const user = await findUserByVerificationToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new verification email.' },
        { status: 400 }
      )
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email has already been verified' },
        { status: 200 }
      )
    }

    // Update user to mark email as verified and clear verification token
    await updateUser(user.id, {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    })

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during email verification' },
      { status: 500 }
    )
  }
}

