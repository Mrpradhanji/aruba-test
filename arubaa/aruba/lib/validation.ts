// Validation utility functions for email, password, and name fields

/**
 * Validates email format using a strict regex pattern
 * Requirements:
 * - Local part must contain at least one letter (a-z, A-Z)
 * - Domain must be valid with proper structure
 * - TLD must be at least 2 characters and contain only letters
 * @param email - The email address to validate
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  // Basic email structure check
  if (!email || typeof email !== 'string') {
    return false
  }

  // Check for basic structure: local@domain.tld
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!basicEmailRegex.test(email)) {
    return false
  }

  // Split email into local and domain parts
  const [localPart, domain] = email.split('@')
  
  if (!localPart || !domain) {
    return false
  }

  // Local part must contain at least one letter (a-z, A-Z)
  // This prevents emails like "123@domain.com" or "@domain.com"
  if (!/[a-zA-Z]/.test(localPart)) {
    return false
  }

  // Local part length validation (RFC 5321)
  if (localPart.length > 64) {
    return false
  }

  // Domain must have at least one dot (for TLD)
  if (!domain.includes('.')) {
    return false
  }

  // Split domain into name and TLD
  const domainParts = domain.split('.')
  const tld = domainParts[domainParts.length - 1]

  // TLD must be at least 2 characters
  if (!tld || tld.length < 2) {
    return false
  }

  // TLD must contain only letters (a-z, A-Z)
  // This prevents invalid TLDs like "123@hot.123" or "123@hot.1"
  if (!/^[a-zA-Z]+$/.test(tld)) {
    return false
  }

  // Domain name (before TLD) must contain at least one letter or number
  // This prevents domains like "123@.com" or "123@.co.uk"
  const domainName = domainParts.slice(0, -1).join('.')
  if (!domainName || domainName.length === 0) {
    return false
  }

  // Final validation with strict regex that ensures:
  // - Local part starts and ends with alphanumeric
  // - Contains at least one letter (already checked above at line 33)
  // - Domain has proper structure
  // - TLD is at least 2 letters
  // 
  // This regex, combined with the letter check above, prevents emails like:
  // - "123@hot.com" (no letters in local part)
  // - "@domain.com" (empty local part)
  // - "123456@test.com" (no letters in local part)
  // 
  // Valid examples: "user123@hotmail.com", "john.doe@example.com", "test123@domain.co.uk"
  const strictEmailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/
  
  // The letter check at line 33 ensures we've already validated presence of at least one letter
  return strictEmailRegex.test(email)
}

/**
 * Validates password requirements:
 * - Minimum 8 characters
 * - Can contain letters, numbers, and special characters
 * @param password - The password to validate
 * @returns true if valid, false otherwise
 */
export function validatePassword(password: string): boolean {
  return password.length >= 8
}

/**
 * Validates name fields (first name, last name)
 * - Must be 2-50 characters long
 * - Can only contain letters, spaces, hyphens, and apostrophes
 * - Must contain at least one letter
 * - No leading/trailing whitespace
 * @param name - The name to validate
 * @returns true if valid, false otherwise
 */
export function validateName(name: string): boolean {
  const trimmed = name.trim();
  // Regex allows letters (including accented characters), spaces, hyphens, and apostrophes
  const nameRegex = /^[\p{L}][\p{L}\s'-]+$/u;
  return (
    trimmed.length >= 2 &&
    trimmed.length <= 50 &&
    nameRegex.test(trimmed) &&
    /[a-zA-Z]/.test(trimmed) // Ensure at least one letter
  );
}

/**
 * Validates that two passwords match
 * @param password - The first password
 * @param confirmPassword - The password confirmation
 * @returns true if passwords match, false otherwise
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}
