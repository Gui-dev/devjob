import { api } from '@/lib/api'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
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

        console.log(' Credentials: ', credentials)

        try {
          const response = await api.post('/users/login', {
            email: credentials?.email,
            password: credentials?.password,
          })
          const { accessToken } = response.data

          const meResponse = await api.get('/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          console.log('meResponse: ', meResponse)

          const { user } = meResponse.data

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('USER: ', user)
      if (user?.accessToken) {
        token.accessToken = user.accessToken

        try {
          const response = await api.get('/me', {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })

          const me = response.data
          token.user = {
            id: me.id,
            name: me.name,
            email: me.email,
            role: me.role,
          }
        } catch (error) {
          console.log('Erro ao buscar dados do usuário no /me', error)
        }
      }

      return token
    },

    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken

      return session
    },
  },

  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
