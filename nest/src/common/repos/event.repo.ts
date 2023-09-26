import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from 'src/common/schemas/event.schema';
import { User } from '../schemas/user.schema';
import { SafeEvent } from '../types';

@Injectable()
export class EventRepository {
  constructor(@InjectModel(Event.name) private db: Model<Event>) {}

  async findMany(query: any): Promise<Event[]> {
    return this.db.find(query).exec();
  }

  async findOne(query: any): Promise<Event | null> {
    return this.db.findOne(query).exec();
  }

  async findOneById(eventId: Types.ObjectId): Promise<SafeEvent | null> {
    try {
      if (!eventId) {
        return null;
      }

      const event = await this.db.findById(eventId).populate('user').exec();

      return {
        ...event.toObject(),
        createdAt: event.createdAt.toISOString(),
        user: {
          ...event.user.toObject(),
          createdAt: event.user.createdAt.toISOString(),
          updatedAt: event.user.updatedAt.toISOString(),
          emailVerified: event.user.emailVerified.toISOString(),
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAll(params: any): Promise<Event[]> {
    return this.db.find(params).sort({ createdAt: 'desc' }).exec();
  }

  async create(dto: any): Promise<Event> {
    const newEvent = new this.db(dto);

    return await newEvent.save();
  }

  async updateOneById(
    eventId: string,
    updates: Partial<Event>,
  ): Promise<Event | null> {
    return this.db.findByIdAndUpdate(eventId, updates, { new: true });
  }

  async updateEventFavorites(
    id: string,
    user: User,
    updates: Partial<Event>,
  ): Promise<Event | null> {
    return await this.db.findOneAndUpdate(
      { _id: id, user: user._id },
      updates,
      {
        new: true,
      },
    );
  }

  async deleteEventByUser(
    eventId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Event | null> {
    return await this.db.findOneAndDelete({ _id: eventId, userId: userId });
  }
}
