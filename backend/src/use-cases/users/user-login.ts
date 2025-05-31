import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import type { IUserRepositoryContract } from '../../contracts/user-repository-contract'
import { createAccessToken, createRefreshToken } from '../../lib/jwt'

interface IUserLoginProps {
  email: string
  password: string
}

export class UserLoginUseCase {
  constructor(private userRepository: IUserRepositoryContract) {}

  public async execute({ email, password }: IUserLoginProps) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const accessToken = createAccessToken(user.id)

    const refreshToken = createRefreshToken(user.id)

    return {
      accessToken,
      refreshToken,
    }
  }
}
