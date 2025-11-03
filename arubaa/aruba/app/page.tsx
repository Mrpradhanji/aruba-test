"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Zap } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Authentication",
    description: "Enterprise-grade security with NextAuth.js and JWT",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Email Verification",
    description: "Secure email verification with Resend",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Protected Routes",
    description: "Secure access to authenticated content",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600"
          >
            Aruba Assessment
          </motion.div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="bg-gray-200 text-gray-700 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4"
          >
            SECURE AUTHENTICATION SYSTEM
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            Secure Authentication
            <span className="block bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
              with Email Verification
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
          >
            A complete authentication solution featuring secure email
            verification powered by Resend. Experience seamless signup and login
            with enhanced security features and a modern, responsive interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg py-6 px-8 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              
            </Link>
          </motion.div>

          {/* Email Verification Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-12"
          >
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
              Email Verification Notice
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              For demo purposes, email verification is configured to work with
              the registered email:
              <span className="font-semibold">merohtensingh3@gmail.com</span>.
              Please use this email to test the verification flow.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-gray-800 mt-16">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          {new Date().getFullYear()} Aruba Assessment. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
