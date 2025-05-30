import type { User } from '../../prisma/generated/prisma'

export type ICreateUserDTO = Omit<User, 'id' | 'createAt'>
