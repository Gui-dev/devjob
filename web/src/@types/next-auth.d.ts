import NextAuth, { type DefaultSession, type DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User extends DefaultUser {
    role?: string
    accessToken?: string
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
      email: string
      role: string
    } & DefaultSession['user']
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }
}
