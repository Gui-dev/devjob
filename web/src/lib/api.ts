import axios from 'axios'
import { getSession } from 'next-auth/react'

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
