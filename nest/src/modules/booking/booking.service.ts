import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { BookingRepository } from 'src/common/repos/booking.repo';
import { Booking } from 'src/common/schemas/booking.schema';
import { SafeBooking } from 'src/common/types';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly repo: BookingRepository,
    private readonly authService: AuthService,
  ) {}

  async createBooking(req: Request): Promise<Booking> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const body = await req.body;

    const { eventId, startDate, endDate, totalPrice } = body;

    if (!eventId || !startDate || !endDate || !totalPrice) {
      throw new Error('Invalid event ID');
    }

    const eventAndBookings = await this.repo.updateWriteOpResult({
      where: {
        _id: eventId,
      },
      data: {
        bookings: {
          create: {
            userId: currentUser.result.user._id,
            startDate,
            endDate,
            totalPrice,
          },
        },
      },
    });

    return eventAndBookings.toJSON();
  }

  async deleteBooking(
    req: Request,
    { params }: { params: { bookingId?: Types.ObjectId } },
  ) {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const { bookingId } = params;

    if (!bookingId) {
      throw new Error('Invalid booking ID');
    }

    const booking = await this.repo.deleteMany({
      where: {
        _id: bookingId,
        OR: [
          { userId: currentUser.result.user._id },
          { event: { userId: currentUser.result.user._id } },
        ],
      },
    });

    return booking.toJSON();
  }

  async getBookings(params: {
    eventId?: string;
    userId?: string;
    authorId?: string;
  }): Promise<SafeBooking[]> {
    try {
      const { eventId, userId, authorId } = params;

      const query: any = {};

      if (eventId) {
        query.eventId = eventId;
      }

      if (userId) {
        query.userId = userId;
      }

      if (authorId) {
        query.event = { userId: authorId };
      }

      const bookings = await this.repo.findMany({
        where: query,
        include: {
          event: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const safeBookings = bookings.map((booking) => ({
        ...booking.toObject(),
        createdAt: booking.bookingDate.toISOString(),
        startDate: booking.event.startDate.toISOString(),
        endDate: booking.event.endDate.toISOString(),
        event: {
          ...booking.event.toObject(),
          createdAt: booking.event.createdAt.toISOString(),
        },
      }));

      return safeBookings;
    } catch (err) {
      throw new Error(err);
    }
  }
}
