import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ReservationRepository } from 'src/common/repos/reservation.repo';
import { Reservation } from 'src/common/schemas/reservation.schema';
import { SafeReservation } from 'src/common/types';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly repo: ReservationRepository,
    private readonly authService: AuthService,
  ) {}

  async createReservation(req: Request): Promise<Reservation> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const body = await req.body;

    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
      throw new Error('Invalid listing ID');
    }

    const listingAndReservations = await this.repo.updateWriteOpResult({
      where: {
        _id: listingId,
      },
      data: {
        reservations: {
          create: {
            userId: currentUser.result.user._id,
            startDate,
            endDate,
            totalPrice,
          },
        },
      },
    });

    return listingAndReservations.toJSON();
  }

  async deleteReservation(
    req: Request,
    { params }: { params: { reservationId?: Types.ObjectId } },
  ) {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const { reservationId } = params;

    if (!reservationId) {
      throw new Error('Invalid reservation ID');
    }

    const reservation = await this.repo.deleteMany({
      where: {
        _id: reservationId,
        OR: [
          { userId: currentUser.result.user._id },
          { listing: { userId: currentUser.result.user._id } },
        ],
      },
    });

    return reservation.toJSON();
  }

  async getReservations(params: {
    listingId?: string;
    userId?: string;
    authorId?: string;
  }): Promise<SafeReservation[]> {
    try {
      const { listingId, userId, authorId } = params;

      const query: any = {};

      if (listingId) {
        query.listingId = listingId;
      }

      if (userId) {
        query.userId = userId;
      }

      if (authorId) {
        query.listing = { userId: authorId };
      }

      const reservations = await this.repo.findMany({
        where: query,
        include: {
          listing: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const safeReservations = reservations.map((reservation) => ({
        ...reservation.toObject(),
        createdAt: reservation.createdAt.toISOString(),
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        listing: {
          ...reservation.listing.toObject(),
          createdAt: reservation.listing.createdAt.toISOString(),
        },
      }));

      return safeReservations;
    } catch (err) {
      throw new Error(err);
    }
  }
}
