import type { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  export interface Session {
    accessToken: string
    user: {
      id: string
      name: string
      email: string
      role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
    }
  }

  export interface User extends DefaultUser {
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  export interface JWT {
    accessToken: string
    user: {
      id: string
      name: string
      email: string
      role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
    }
  }
}
