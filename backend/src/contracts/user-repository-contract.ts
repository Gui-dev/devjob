import type { User } from '../../prisma/generated/prisma'
import type { ICreateUserDTO } from '../dtos/create-user'

export interface IUserRepositoryContract {
  create(user: ICreateUserDTO): Promise<User>
  findById(userId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}
