import { sign, verify } from 'jsonwebtoken'
import { env } from './env'

export const createAccessToken = (sub: string) => {
  return sign({ sub }, env.JWT_SECRET, { expiresIn: '15m' })
}

export const createRefreshToken = (sub: string) => {
  return sign({ sub }, env.JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return verify(token, env.JWT_SECRET)
}
