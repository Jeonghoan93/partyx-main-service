import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from 'src/common/schemas/reservation.schema';

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
  ) {}

  async updateWriteOpResult({
    where,
    data,
  }: {
    where: any;
    data: any;
  }): Promise<Reservation> {
    const updateData = {
      $push: {
        reservations: data.reservations.create,
      },
    };

    return this.reservationModel
      .findOneAndUpdate(where, updateData, { new: true })
      .exec();
  }

  async deleteMany(query: any): Promise<any> {
    return this.reservationModel.deleteMany(query).exec();
  }

  async findMany(query: any): Promise<Reservation[]> {
    return this.reservationModel.find(query).exec();
  }

  async updateOneById(
    id: string,
    updates: Partial<Reservation>,
  ): Promise<Reservation | null> {
    return this.reservationModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
  }
}
