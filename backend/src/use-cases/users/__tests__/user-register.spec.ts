import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../repositories/in-memory/in-memory-user-repository'
import { UserRegisterUseCase } from '../user-register'

let userRepository: InMemoryUserRepository
let userRegister: UserRegisterUseCase

describe('User Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    userRegister = new UserRegisterUseCase(userRepository)
  })

  it('should be able to create a new user', async () => {
    const { id } = await userRegister.execute({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    expect(id).toBeDefined()
  })

  it('should not be able to create a user with the same email', async () => {
    await userRegister.execute({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    await expect(
      userRegister.execute({
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: '123456',
      }),
    ).rejects.toThrowError('User already exists')
  })
})
