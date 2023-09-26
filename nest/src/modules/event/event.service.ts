import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { EventRepository } from 'src/common/repos/event.repo';
import { Event } from 'src/common/schemas/event.schema';
import { SafeEvent } from 'src/common/types';
import { AuthService } from '../auth/auth.service';

export interface IEventsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

@Injectable()
export class EventService {
  constructor(
    private readonly repo: EventRepository,
    private readonly authService: AuthService,
  ) {}

  async createEvent(req: Request): Promise<Event> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const body = await req.body;
    const {
      title,
      description,
      imageSrc,
      category,
      maxGuests,
      minGuests,
      location,
      price,
      eventDate,
      eventTime,
    } = body;

    Object.keys(body).forEach((value: any) => {
      if (!body[value]) {
        throw new Error(`${value} is required`);
      }
    });

    const newEvent = await this.repo.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        roomCount: maxGuests,
        guestCount: minGuests,
        bathroomCount: null,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUser.result.user._id,
        eventDate,
        eventTime,
      },
    });

    return newEvent;
  }

  async getEventById(params: { eventId?: string }): Promise<SafeEvent> {
    try {
      const { eventId } = params;

      const event = await this.repo.findOne({
        where: {
          _id: eventId,
        },
        include: {
          user: true,
        },
      });

      if (!event) {
        return null;
      }

      return {
        ...event.toObject(),
        createdAt: event.createdAt.toISOString(),
        user: {
          ...event.toObject().user.toObject(),
          createdAt: event.user.createdAt.toISOString(),
          updatedAt: event.user.updatedAt.toISOString(),
          emailVerified: event.toObject().user.emailVerified
            ? event.toObject().user.emailVerified.toISOString()
            : null,
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getEvents(params: IEventsParams): Promise<SafeEvent[]> {
    try {
      const {
        userId,
        roomCount,
        guestCount,
        bathroomCount,
        locationValue,
        startDate,
        endDate,
        category,
      } = params;

      const query: any = {};

      if (userId) {
        query.userId = userId;
      }

      if (roomCount) {
        query.roomCount = {
          $gte: +roomCount,
        };
      }

      if (guestCount) {
        query.guestCount = {
          $gte: +guestCount,
        };
      }

      if (bathroomCount) {
        query.bathroomCount = {
          $gte: +bathroomCount,
        };
      }

      if (locationValue) {
        query.locationValue = locationValue;
      }

      if (category) {
        query.category = category;
      }

      if (startDate && endDate) {
        query.bookings = {
          $not: {
            $elemMatch: {
              $or: [
                {
                  endDate: { $gte: startDate },
                  startDate: { $lte: startDate },
                },
                {
                  startDate: { $lte: endDate },
                  endDate: { $gte: endDate },
                },
              ],
            },
          },
        };
      }

      const events = await this.repo.findMany({
        where: query,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const safeEvents = events.map((event) => ({
        ...event.toObject(),
        createdAt: event.createdAt.toISOString(),
      }));

      return safeEvents;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getFavoriteEvents(req: Request): Promise<SafeEvent[]> {
    try {
      const currentUser = await this.authService.getCurrentUser(req);

      if (!currentUser) {
        return [];
      }

      const favoriteEvents = await this.repo.findMany({
        where: {
          _id: {
            $in: [...(currentUser.result.user.favoriteIds || [])],
          },
        },
      });

      const safeFavoriteEvents = favoriteEvents.map((event) => ({
        ...event.toObject(),
        createdAt: event.createdAt.toISOString(),
      }));

      return safeFavoriteEvents;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteFavoriteEvent(
    req: Request,
    { params }: { params: { eventId: Types.ObjectId } },
  ): Promise<Event> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const { eventId } = params;

    if (!eventId) {
      throw new Error('Invalid event ID');
    }

    const event = await this.repo.deleteEventByUser(
      eventId,
      currentUser.result.user._id,
    );

    return event;
  }

  async deleteEvent(
    req: Request,
    { params }: { params: { eventId: Types.ObjectId } },
  ): Promise<Event> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const { eventId } = params;

    if (!eventId) {
      throw new Error('Invalid event ID');
    }

    const event = await this.repo.deleteEventByUser(
      eventId,
      currentUser.result.user._id,
    );

    return event;
  }
}
