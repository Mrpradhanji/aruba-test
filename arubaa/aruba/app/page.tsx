"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-gray-950 px-6 text-center">
      {/* Animated Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 mb-6"
      >
        Assessment
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        A responsive authentication system built using{" "}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          Next.js
        </span>
        , Tailwind CSS, and NextAuth for secure login and signup. It features
        email and password validation, smooth animations with Framer Motion, and
        a clean, professional UI.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex gap-6"
      >
        <Link href="/login">
          <Button
            className="px-8 py-3 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
          >
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button
            variant="outline"
            className="px-8 py-3 text-lg font-medium border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 rounded-xl"
          >
            Sign Up
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
