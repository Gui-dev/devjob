import type { User } from '../../prisma/generated/prisma'
import type { IUserRepositoryContract } from '../contracts/user-repository-contract'
import type { ICreateUserDTO } from '../dtos/create-user'

import { prisma } from '../lib/prisma'

export class UserRepository implements IUserRepositoryContract {
  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    return user
  }

  public async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
