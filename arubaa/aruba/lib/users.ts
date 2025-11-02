import { randomUUID } from 'crypto'

// Simple in-memory user store
// In production, replace this with a proper database

interface User {
  id: string
  email: string
  passwordHash: string
  name: string | null
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
  verificationToken: string | null
  verificationTokenExpires: Date | null
  failedLoginAttempts: number
  lastFailedLoginAttempt: Date | null
  accountLockedUntil: Date | null
  createdAt: Date
  updatedAt: Date
}

// In-memory storage
const users: Map<string, User> = new Map()

export async function findUserByEmail(email: string): Promise<User | null> {
  // Case-insensitive email lookup
  const normalizedEmail = email.toLowerCase().trim()
  const user = Array.from(users.values()).find(u => u.email.toLowerCase().trim() === normalizedEmail)
  return user || null
}

export async function findUserById(id: string): Promise<User | null> {
  const user = users.get(id)
  return user || null
}

export async function createUser(data: {
  email: string
  passwordHash: string
  name: string
  role?: 'USER' | 'ADMIN'
}): Promise<User> {
  const id = randomUUID()
  const now = new Date()
  
  // Normalize email to lowercase for consistency
  const normalizedEmail = data.email.toLowerCase().trim()
  
  // Check if user already exists
  const existing = await findUserByEmail(normalizedEmail)
  if (existing) {
    throw new Error('User with this email already exists')
  }
  
  const user: User = {
    id,
    email: normalizedEmail,
    passwordHash: data.passwordHash,
    name: data.name,
    role: data.role || 'USER',
    emailVerified: false,
    verificationToken: null,
    verificationTokenExpires: null,
    failedLoginAttempts: 0,
    lastFailedLoginAttempt: null,
    accountLockedUntil: null,
    createdAt: now,
    updatedAt: now,
  }
  
  users.set(id, user)
  return user
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
  const user = users.get(id)
  if (!user) return null
  
  // Ensure Date objects are properly created
  const updateData: Partial<User> = { ...data }
  
  if (updateData.lastFailedLoginAttempt !== undefined) {
    if (updateData.lastFailedLoginAttempt === null) {
      updateData.lastFailedLoginAttempt = null
    } else if (!(updateData.lastFailedLoginAttempt instanceof Date)) {
      updateData.lastFailedLoginAttempt = new Date(updateData.lastFailedLoginAttempt)
    }
  }
  
  if (updateData.accountLockedUntil !== undefined) {
    if (updateData.accountLockedUntil === null) {
      updateData.accountLockedUntil = null
    } else if (!(updateData.accountLockedUntil instanceof Date)) {
      updateData.accountLockedUntil = new Date(updateData.accountLockedUntil)
    }
  }

  if (updateData.verificationTokenExpires !== undefined) {
    if (updateData.verificationTokenExpires === null) {
      updateData.verificationTokenExpires = null
    } else if (!(updateData.verificationTokenExpires instanceof Date)) {
      updateData.verificationTokenExpires = new Date(updateData.verificationTokenExpires)
    }
  }
  
  const updated: User = {
    ...user,
    ...updateData,
    updatedAt: new Date(),
  } as User
  
  users.set(id, updated)
  return updated
}

export async function getAllUsers(): Promise<User[]> {
  return Array.from(users.values())
}

export async function findUserByVerificationToken(token: string): Promise<User | null> {
  const user = Array.from(users.values()).find(u => u.verificationToken === token)
  return user || null
}

