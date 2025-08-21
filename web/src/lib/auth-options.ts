import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import type { JWT } from 'next-auth/jwt'

import { api } from '@/lib/api'

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const response = await axios.post('http://localhost:3333/token/refresh', {
      refreshToken: token.refreshToken,
    })
    const { accessToken, refreshToken } = response.data

    return {
      ...token,
      accessToken,
      accessTokenExpires: Date.now() + 9 * 60 * 1000, // 15 minutes
      refreshToken,
    }
  } catch (error) {
    console.log('Erro ao atualizar token', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await api.post('/users/login', {
            email: credentials?.email,
            password: credentials?.password,
          })
          const { accessToken, refreshToken } = response.data

          const meResponse = await api.get('/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          const { user } = meResponse.data

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          accessToken: user.accessToken,
          accessTokenExpires: Date.now() + 9 * 60 * 1000, // 9 minute
          refreshToken: user.refreshToken,
          user: {
            id: user.id,
            name: user.name as string,
            email: user.email as string,
            role: user.role as string,
          },
        }
      }

      if (Date.now() < (token.accessTokenExpires as number) - 60 * 1000) {
        return token
      }

      return refreshAccessToken(token)
    },

    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken as string
      session.error = token.error as string

      return session
    },
  },

  pages: {
    signIn: '/login',
  },
}
