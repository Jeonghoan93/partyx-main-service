import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/common/schemas/account.schema';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async findOneById(id: string): Promise<Account | null> {
    return this.accountModel.findById(id).exec();
  }

  async create(accountData: Partial<Account>): Promise<Account> {
    const newAccount = new this.accountModel(accountData);
    return newAccount.save();
  }

  async updateOneById(
    id: string,
    updates: Partial<Account>,
  ): Promise<Account | null> {
    return this.accountModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
  }

  async deleteOneById(id: string): Promise<Account | null> {
    return this.accountModel.findByIdAndDelete(id).exec();
  }
}
