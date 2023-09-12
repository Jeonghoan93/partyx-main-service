import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Account } from 'src/common/schemas/account.schema';
import { AccountService } from './account.service';

@Controller('api/account')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Account | null> {
    return this.service.findOneById(id);
  }

  @Post()
  async create(@Body() accountData: Partial<Account>): Promise<Account> {
    return this.service.create(accountData);
  }

  @Put(':id')
  async updateOneById(
    @Param('id') id: string,
    @Body() updates: Partial<Account>,
  ): Promise<Account | null> {
    return this.service.updateOneById(id, updates);
  }

  @Delete(':id')
  async deleteOneById(@Param('id') id: string): Promise<Account | null> {
    return this.service.deleteOneById(id);
  }
}
