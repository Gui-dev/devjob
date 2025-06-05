import { hash } from 'bcrypt'
import type { IUserRepositoryContract } from '../../contracts/user-repository-contract'

interface IUserRegisterProps {
  name: string
  email: string
  password: string
  role: 'CANDIDATE' | 'RECRUITER'
}

export class UserRegisterUseCase {
  constructor(private userRepository: IUserRepositoryContract) {}

  public async execute({ name, email, password, role }: IUserRegisterProps) {
    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) {
      throw new Error('User already exists')
    }

    const passwordHash = await hash(password, 8)

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
      role,
    })

    return {
      id: user.id,
    }
  }
}
