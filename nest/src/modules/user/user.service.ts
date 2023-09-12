import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/common/repos/user.repo';
import { User } from 'src/common/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async findAll(type: string): Promise<{
    status: string;
    message: 'Users fetched successfully';
    result: User[] | null;
  }> {
    const users = await this.repo.find({ type });

    return {
      status: 'success',
      message: 'Users fetched successfully',
      result: users,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.repo.findOneByEmail(email);
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.repo.create(dto);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repo.findOneById(id);
  }
}
