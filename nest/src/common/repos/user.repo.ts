import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private db: Model<User>) {}

  async find(query: any): Promise<User[] | null> {
    return await this.db.find(query);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.db.findOne({ email }).exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.db.findById(id).exec();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const newUser = new this.db(dto);
    return newUser.save();
  }

  async updateOneById(id: any, data: Partial<User>): Promise<User | null> {
    return this.db.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async updateOneByEmail(
    email: string,
    data: Partial<User>,
  ): Promise<User | null> {
    return this.db
      .findOneAndUpdate(
        {
          email,
        },
        data,
        { new: true },
      )
      .exec();
  }

  async deleteOneById(id: string): Promise<User | null> {
    return this.db.findByIdAndDelete(id).exec();
  }
}
