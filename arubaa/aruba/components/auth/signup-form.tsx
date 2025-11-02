// Signup form component with extended fields for better user profiling
"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "@/lib/validation";
import { toast } from "sonner";

export function SignupForm() {
  // Basic form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states for each field
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [userTypeError, setUserTypeError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  // Validate first name on blur
  const handleFirstNameBlur = () => {
    if (!firstName) {
      setFirstNameError("First name is required");
    } else if (!validateName(firstName)) {
      setFirstNameError("First name must be at least 2 characters");
    } else {
      setFirstNameError("");
    }
  };

  // Validate last name on blur
  const handleLastNameBlur = () => {
    if (!lastName) {
      setLastNameError("Last name is required");
    } else if (!validateName(lastName)) {
      setLastNameError("Last name must be at least 2 characters");
    } else {
      setLastNameError("");
    }
  };

  // Validate email on blur
  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("Email is required");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Validate password on blur
  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError("Password is required");
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  // Validate confirm password
  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");

    // Validate all fields
    let hasErrors = false;

    if (!firstName || !validateName(firstName)) {
      setFirstNameError("First name must be at least 2 characters");
      hasErrors = true;
    }

    if (!lastName || !validateName(lastName)) {
      setLastNameError("Last name must be at least 2 characters");
      hasErrors = true;
    }

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasErrors = true;
    }

    if (!password || !validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters");
      hasErrors = true;
    }

    if (!confirmPassword || confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      hasErrors = true;
    }

    if (!userType) {
      setUserTypeError("Please select an account type");
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      // Call signup API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        setGeneralError(data.error || "An error occurred. Please try again.");
        return;
      }

      // Success - show success message about email verification
      setSuccessMessage(
        data.message || "Account created successfully! Please check your email to verify your account."
      );

      // Redirect to login page after a longer delay to allow user to read message
      setTimeout(() => {
        window.location.href = "/login";
      }, 4000);
    } catch (error) {
      console.error("Signup error:", error);
      setGeneralError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthTextColors = [
    "text-red-600 dark:text-red-400",
    "text-orange-600 dark:text-orange-400",
    "text-yellow-600 dark:text-yellow-400",
    "text-lime-600 dark:text-lime-400",
    "text-green-600 dark:text-green-400",
  ];

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-2 shadow-2xl transition-all duration-300 hover:shadow-3xl">
      <CardHeader className="space-y-3 text-center pb-6 px-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription className="text-base">
          Join us today and start your journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* General error message */}
          {generalError && (
            <div className="p-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
              <svg
                className="w-5 h-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {generalError}
            </div>
          )}

          {/* Success message with custom SVG icon */}
          {successMessage && (
            <div className="p-4 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
              <svg
                className="w-5 h-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          )}

          {/* First name field */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Rohit"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setFirstNameError("");
              }}
              onBlur={handleFirstNameBlur}
              className={`h-11 transition-all duration-200 ${
                firstNameError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              disabled={isLoading}
            />
            {firstNameError && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {firstNameError}
              </p>
            )}
          </div>

          {/* Last name field */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Singh"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setLastNameError("");
              }}
              onBlur={handleLastNameBlur}
              className={`h-11 transition-all duration-200 ${
                lastNameError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              disabled={isLoading}
            />
            {lastNameError && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {lastNameError}
              </p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              onBlur={handleEmailBlur}
              className={`h-11 transition-all duration-200 ${
                emailError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              disabled={isLoading}
            />
            {emailError && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {emailError}
              </p>
            )}
          </div>

          {/* Account type dropdown */}
          <div className="space-y-2">
            <Label htmlFor="userType" className="text-sm font-medium">
              Account Type
            </Label>
            <Select
              value={userType}
              onValueChange={(value) => {
                setUserType(value);
                setUserTypeError("");
              }}
              disabled={isLoading}
            >
              <SelectTrigger
                className={`h-11 transition-all duration-200 ${
                  userTypeError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
              </SelectContent>
            </Select>
            {userTypeError && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {userTypeError}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                onBlur={handlePasswordBlur}
                className={`h-11 pr-10 transition-all duration-200 ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                disabled={isLoading}
              />
              {/* Show/hide password button with SVG icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye off SVG icon
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 1.657-.672 3.157-1.757 4.243A6 6 0 0121 12a6 6 0 00-6-6"
                    />
                  </svg>
                ) : (
                  // Eye SVG icon
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {passwordError}
              </p>
            )}
            {/* Password strength indicator */}
            {password && (
              <div className="space-y-2 mt-3">
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        i < passwordStrength
                          ? `${
                              strengthColors[
                                Math.min(i, strengthColors.length - 1)
                              ]
                            } shadow-md`
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-medium">
                  Password strength:{" "}
                  <span
                    className={
                      strengthTextColors[Math.min(passwordStrength - 1, 4)] ||
                      "text-slate-600 dark:text-slate-400"
                    }
                  >
                    {strengthLabels[Math.min(passwordStrength - 1, 4)] ||
                      "Very Weak"}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm password field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                onBlur={handleConfirmPasswordBlur}
                className={`h-11 pr-10 transition-all duration-200 ${
                  confirmPasswordError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                disabled={isLoading}
              />
              {/* Show/hide confirm password button with SVG icon */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  // Eye off SVG icon
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 1.657-.672 3.157-1.757 4.243A6 6 0 0121 12a6 6 0 00-6-6"
                    />
                  </svg>
                ) : (
                  // Eye SVG icon
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* Terms of service checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 rounded border-border accent-primary"
              disabled={isLoading}
              required
            />
            <Label
              htmlFor="terms"
              className="text-xs text-muted-foreground font-normal"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-12 mt-6 text-base font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </Button>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
