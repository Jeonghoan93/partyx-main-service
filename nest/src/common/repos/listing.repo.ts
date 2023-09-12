import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Listing } from 'src/common/schemas/listing.schema';
import { ListingDTO } from 'src/modules/listing/dto/listing.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class ListingRepository {
  constructor(@InjectModel(Listing.name) private db: Model<Listing>) {}

  async findMany(query: any): Promise<Listing[]> {
    return this.db.find(query).exec();
  }

  async findOne(query: any): Promise<Listing | null> {
    return this.db.findOne(query).exec();
  }

  async findOneById(listingId: Types.ObjectId): Promise<ListingDTO | null> {
    try {
      if (!listingId) {
        return null;
      }

      const listing = await this.db.findById(listingId).populate('user').exec();

      return {
        ...listing.toObject(),
        createdAt: listing.createdAt.toISOString(),
        user: {
          ...listing.user.toObject(),
          createdAt: listing.user.createdAt.toISOString(),
          updatedAt: listing.user.updatedAt.toISOString(),
          emailVerified: listing.user.emailVerified.toISOString(),
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAll(params: any): Promise<Listing[]> {
    return this.db.find(params).sort({ createdAt: 'desc' }).exec();
  }

  async create(dto: any): Promise<Listing> {
    const newListing = new this.db(dto);

    return await newListing.save();
  }

  async updateOneById(
    id: Types.ObjectId,
    updates: Partial<Listing>,
  ): Promise<Listing | null> {
    return this.db.findByIdAndUpdate(id, updates, { new: true });
  }

  async updateListingFavorites(
    id: string,
    user: User,
    updates: Partial<Listing>,
  ): Promise<Listing | null> {
    return await this.db.findOneAndUpdate(
      { _id: id, user: user._id },
      updates,
      {
        new: true,
      },
    );
  }

  async deleteListingByUser(
    listingId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Listing | null> {
    return await this.db.findOneAndDelete({ _id: listingId, userId: userId });
  }
}
