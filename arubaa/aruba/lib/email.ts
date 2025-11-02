import { Resend } from 'resend'

interface SendVerificationEmailParams {
  email: string
  name: string
  verificationToken: string
}

// Helper function to get the base URL for both local and Vercel environments
function getBaseUrl(): string {
  // Check for explicit NEXT_PUBLIC_BASE_URL (highest priority)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }

  // Vercel automatically provides VERCEL_URL in production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Vercel also provides VERCEL_BRANCH_URL for preview deployments
  if (process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`
  }

  // Default to localhost for development
  return 'http://localhost:3000'
}

export async function sendVerificationEmail({
  email,
  name,
  verificationToken,
}: SendVerificationEmailParams): Promise<void> {
  // Early return if API key is not configured
  if (!process.env.RESEND_API_KEY) {
    const error = 'RESEND_API_KEY environment variable is not set'
    console.warn(`⚠ ${error} - skipping email send`)
    throw new Error(error) // Throw error so signup route knows email wasn't sent
  }

  // Validate API key format (Resend keys start with 're_')
  if (!process.env.RESEND_API_KEY.startsWith('re_')) {
    const error = 'Invalid RESEND_API_KEY format. Keys should start with "re_"'
    console.error(`✗ ${error}`)
    throw new Error(error)
  }

  try {
    console.log('📧 Initializing Resend client...')
    // Initialize Resend client inside function to avoid module-level errors
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Get the base URL - works for both local and Vercel
    const baseUrl = getBaseUrl()
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`

    // Validate from email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    console.log('📧 Attempting to send verification email...')
    console.log('   To:', email)
    console.log('   From:', fromEmail)
    console.log('   Base URL:', baseUrl)
    console.log('   Verification URL:', `${baseUrl}/verify-email?token=${verificationToken.substring(0, 20)}...`)
    
    // Send email using Resend
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; margin-bottom: 20px;">Hello ${name},</p>
              <p style="font-size: 16px; margin-bottom: 30px;">
                Thank you for signing up! Please verify your email address by clicking the button below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="font-size: 12px; color: #667eea; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                This link will expire in 24 hours.
              </p>
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #999; font-size: 12px;">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </body>
        </html>
      `,
      text: `
        Hello ${name},
        
        Thank you for signing up! Please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, you can safely ignore this email.
      `,
    })

    // Check if email was sent successfully
    // Resend returns { data: {...} } on success or { error: {...} } on failure
    if (result.error) {
      console.error('Resend API error:', JSON.stringify(result.error, null, 2))
      const errorMessage = result.error.message || JSON.stringify(result.error)
      throw new Error(`Failed to send email: ${errorMessage}`)
    }

    if (!result.data) {
      console.warn('Resend API returned unexpected result:', result)
      throw new Error('Failed to send email: Unexpected response from email service')
    }

    console.log('Verification email sent successfully to:', email, 'ID:', result.data.id)
  } catch (error) {
    console.error('Error sending verification email:', error)
    // Re-throw with more context, but this will be caught by the signup route
    const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email'
    throw new Error(`Email sending failed: ${errorMessage}`)
  }
}

