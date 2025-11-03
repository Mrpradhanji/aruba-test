# aruba - Assessment

A secure, scalable, and responsive authentication system built with Next.js, NextAuth, and Tailwind CSS. This project provides a complete authentication solution with email/password authentication, protected routes, and a beautiful, responsive UI.

## Resend Email Verification

- **Resend Email Verification**

  - Resend Email Verification
  - During development merohtisingh3@gmail.com is registered for free resend account so the verification goes on only registered email id
  - 


## Features

- **Secure Authentication**

  - Email/Password authentication
  - JWT-based session management
  - Protected routes
  - CSRF protection
  - Secure password hashing with bcrypt

- **Modern UI/UX**

  - Responsive design
  - Smooth animations with Framer Motion
  - Clean, accessible components
  - Loading and error states

- **Developer Experience**
  - TypeScript support
  - Form validation with Zod
  - Environment variable validation
  - ESLint and Prettier configured

## Tech Stack

- **Frontend**

  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Radix UI Components
  - Lucide Icons

- **Backend**
  - Next.js API Routes
  - NextAuth.js
  - JWT
  - Zod (validation)
  - bcryptjs (password hashing)

## Project Structure

```
aruba/
├── app/                    # App Router
│   ├── api/                # API routes
│   │   └── auth/           # Authentication endpoints
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── success/            # Success page after auth
├── components/             # Reusable components
│   ├── auth/               # Auth-related components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
│   ├── auth.ts             # Auth utilities
│   └── validation.ts       # Form validation schemas
├── public/                 # Static files
└── styles/                 # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mrpradhanji/aruba-test.git
   cd aruba
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   RESEND_API_KEY=your-reload-api-key
   SESSION_SECRET = your-jwt-secret-key
   RESEND_FROM_EMAIL = onboarding@resend.dev
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable          | Required | Description                      |
| ----------------- | -------- | -------------------------------- |
| `NEXTAUTH_URL`    | Yes      | Base URL of your application     |
| `RESEND_API_KEY`  | Yes      | API key for Resend email service |
| `SESSION_SECRET`  | Yes      | Secret key for session management|
| `RESEND_FROM_EMAIL` | Yes | From email address for Resend |

## Authentication Flow

1. **Registration**

   - User fills out the signup form
   - Form is validated on the client and server
   - Password is hashed using bcrypt
   - User is created in the database
   - Verification email is sent (if email verification is enabled)
   - User is redirected to the login page

2. **Login**

   - User enters email and password
   - Credentials are validated
   - Session is created and JWT token is set
   - User is redirected to the dashboard

3. **Protected Routes**
   - Routes are wrapped with authentication checks
   - Unauthenticated users are redirected to login
   - Session is validated on each request

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

Built with ❤️ by Rohit Kumar Singh
