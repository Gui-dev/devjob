import { randomUUID } from 'node:crypto'

import type { IUserRepositoryContract } from './../../contracts/user-repository-contract'
import type { User } from './../../../prisma/generated/prisma'
import type { ICreateUserDTO } from './../../dtos/create-user'

export class InMemoryUserRepository implements IUserRepositoryContract {
  private users: User[] = []

  public async create(data: ICreateUserDTO): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
    }

    this.users.push(user)

    return user
  }

   public async findById(userId: string): Promise<User | null> {
    const user = this.users.find(user => user.id === userId) ?? null
    return user
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email) ?? null
    return user
  }

  public clear() {
    this.users = []
  }
}
