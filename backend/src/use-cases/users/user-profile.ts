import type { IUserRepositoryContract } from '@/contracts/user-repository-contract'

interface IUserProfileProps {
  userId: string
}

export class UserProfileUseCase {
  constructor(private readonly userRepository: IUserRepositoryContract) {}

  public async execute({ userId }: IUserProfileProps) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  }
}
