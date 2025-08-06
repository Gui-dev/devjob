import axios from 'axios'
import { getSession, signIn, signOut } from 'next-auth/react'

interface FailedRequest {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

api.interceptors.request.use(async config => {
  const session = await getSession()

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  for (const { resolve, reject } of failedQueue) {
    if (token) {
      resolve(token)
    } else {
      reject(error)
    }
  }
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async (error: unknown) => {
    // biome-ignore lint/suspicious/noExplicitAny: unknow
    const originalRequest = (error as any).config

    if (
      // biome-ignore lint/suspicious/noExplicitAny: unknow
      (error as any).response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
      }

      isRefreshing = true

      try {
        const { data } = await axios.post(
          'http://localhost:3333/token/refresh',
          {}, // Body da requisição, pode ser vazio
          {
            withCredentials: true, // Garante que os cookies são enviados
          },
        )

        const { token } = data

        await signIn('credentials', {
          redirect: false,
          accessToken: token,
        })

        processQueue(null, token)

        originalRequest.headers.Authorization = `Bearer ${token}`

        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        await signOut()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
