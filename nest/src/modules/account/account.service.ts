import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/common/repos/account.repo';
import { Account } from 'src/common/schemas/account.schema';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async findOneById(id: string): Promise<Account | null> {
    return this.accountRepository.findOneById(id);
  }

  async create(accountData: Partial<Account>): Promise<Account> {
    return this.accountRepository.create(accountData);
  }

  async updateOneById(
    id: string,
    updates: Partial<Account>,
  ): Promise<Account | null> {
    return this.accountRepository.updateOneById(id, updates);
  }

  async deleteOneById(id: string): Promise<Account | null> {
    return this.accountRepository.deleteOneById(id);
  }
}
