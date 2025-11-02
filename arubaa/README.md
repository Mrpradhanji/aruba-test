# Aruba - Assessment

Structure

## 🚀 Features

- **Next.js 13+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **Authentication** with NextAuth.js
- **Responsive Design** for all devices
- **Form Handling** with React Hook Form
- **Modern UI/UX** with smooth animations

## 📦 Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Git

## 🏗️ Project Structure

```
aruba/
├── app/                  # App router pages and layouts
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── ui/              # Shadcn/UI components
│   └── ...
├── lib/                 # Utility functions and configurations
├── public/              # Static files
└── styles/              # Global styles
```

## 🎨 Styling

This project uses:

- **Tailwind CSS** for utility-first styling
- **CSS Modules** for component-scoped styles
- **Class Variance Authority** for type-safe component variants

## 📧 Email Verification Setup

This project includes email verification using Resend. Follow these steps to configure:

### Local Development

1. Create a `.env.local` file in the `aruba/` directory
2. Add the following environment variables:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SESSION_SECRET=your_random_secret_string_here
```

3. Get your Resend API key from [https://resend.com/api-keys](https://resend.com/api-keys)
4. Restart your dev server after adding environment variables

### Vercel Deployment

The app automatically detects Vercel's URL, so you only need to set:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   - **RESEND_API_KEY**: `re_your_api_key_here` (Production, Preview, Development)
   - **RESEND_FROM_EMAIL**: `onboarding@resend.dev` (Production, Preview, Development)
   - **NEXT_PUBLIC_BASE_URL**: `https://aruba-test.vercel.app` (Production only) - Optional, as Vercel auto-detects
   - **SESSION_SECRET**: `your_random_secret_string_here` (Production, Preview, Development)

4. After adding variables, **redeploy** your application

**Note**: The app automatically uses `VERCEL_URL` provided by Vercel, so `NEXT_PUBLIC_BASE_URL` is optional but recommended for production.