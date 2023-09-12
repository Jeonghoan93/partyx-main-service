import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from 'src/common/middleware/role.decorators';
import { User } from 'src/common/schemas/user.schema';
import { userTypes } from 'src/common/types';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('email/:email')
  async getUserByEmail(email: string): Promise<User | null> {
    return this.service.getUserByEmail(email);
  }

  @Get()
  @Roles(userTypes.ADMIN)
  async findAll(@Query('type') type: string) {
    return await this.service.findAll(type);
  }
}
