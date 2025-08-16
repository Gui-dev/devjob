import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  export interface User {
    role?: string
    accessToken?: string | undefined
    refreshToken?: string | undefined
  }

  export interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
    accessToken?: string
    refreshToken?: string
    error: string
  }
}

declare module 'next-auth/jwt' {
  export interface JWT {
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    error?: string
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }
}
