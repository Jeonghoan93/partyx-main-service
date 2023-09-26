import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from 'src/common/schemas/booking.schema';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async updateWriteOpResult({
    where,
    data,
  }: {
    where: any;
    data: any;
  }): Promise<Booking> {
    const updateData = {
      $push: {
        bookings: data.bookings.create,
      },
    };

    return this.bookingModel
      .findOneAndUpdate(where, updateData, { new: true })
      .exec();
  }

  async deleteMany(query: any): Promise<any> {
    return this.bookingModel.deleteMany(query).exec();
  }

  async findMany(query: any): Promise<Booking[]> {
    return this.bookingModel.find(query).exec();
  }

  async updateOneById(
    id: string,
    updates: Partial<Booking>,
  ): Promise<Booking | null> {
    return this.bookingModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
  }
}
