import { sign, verify } from 'jsonwebtoken'

export const createAccessToken = (sub: string) => {
  return sign({ sub }, String(process.env.JWT_SECRET), { expiresIn: '15m' })
}

export const createRefreshToken = (sub: string) => {
  return sign({ sub }, String(process.env.JWT_SECRET), { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return verify(token, String(process.env.JWT_SECRET))
}
