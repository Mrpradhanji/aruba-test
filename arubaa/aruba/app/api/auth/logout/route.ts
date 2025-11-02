import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'session_token'

export async function POST() {
  try {
    // Clear the session cookie by setting it to expire now
    (await cookies()).set(SESSION_COOKIE, '', { expires: new Date(0) })
    
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}

// Also handle GET requests for compatibility
export { POST as GET }
