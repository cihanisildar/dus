import { db } from '../index'
import { users, type User, type NewUser } from '../schema'
import { eq } from 'drizzle-orm'

export const userQueries = {
  // Get user by email
  async getByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  },

  // Get user by ID
  async getById(id: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  },

  // Create user
  async create(data: {
    id: string
    name: string
    email: string
    phone: string
    passwordHash: string
  }): Promise<User> {
    const [user] = await db.insert(users).values({
      ...data,
      accountStatus: 'registered',
      verifiedPeriods: [],
      paidPeriods: [],
    }).returning()

    return user
  },

  // Update user
  async update(id: string, data: Partial<NewUser>): Promise<User> {
    const [updated] = await db.update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()

    return updated
  },

  // Update last login
  async updateLastLogin(id: string): Promise<void> {
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id))
  },
}
