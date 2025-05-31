import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../repositories/in-memory/in-memory-user-repository'
import { UserLoginUseCase } from '../user-login'
import { UserRegisterUseCase } from '../user-register'

let userRepository: InMemoryUserRepository
let userRegister: UserRegisterUseCase
let sut: UserLoginUseCase

describe('User Login Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    userRegister = new UserRegisterUseCase(userRepository)
    sut = new UserLoginUseCase(userRepository)
  })

  it('should be able to login successfully with valid credentials', async () => {
    await userRegister.execute({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    const response = await sut.execute({
      email: 'bruce@email.com',
      password: '123456',
    })

    expect(response).toHaveProperty('accessToken')
    expect(response).toHaveProperty('refreshToken')
  })

  it('should not be able to login with wrong email', async () => {
    await userRegister.execute({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    await expect(() => {
      return sut.execute({
        email: 'wrong_email@email.com',
        password: '1234567',
      })
    }).rejects.toThrowError('Invalid credentials')
  })

  it('should not be able to login with wrong password', async () => {
    await userRegister.execute({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    await expect(() => {
      return sut.execute({
        email: 'bruce@email.com',
        password: 'wrong_password',
      })
    }).rejects.toThrowError('Invalid credentials')
  })
})
