import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Reservation } from 'src/common/schemas/reservation.schema';
import { SafeReservation } from 'src/common/types';
import { ReservationService } from './reservation.service';

@Controller('api/reservation')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @Get()
  async getReservations(
    @Query() query: { listingID?: string; userID?: string; authorId?: string },
  ): Promise<SafeReservation[]> {
    try {
      return await this.service.getReservations(query);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Post()
  async createReservation(@Req() req: Request): Promise<Reservation> {
    try {
      return await this.service.createReservation(req);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':reservationId')
  async deleteReservation(
    @Req() req: Request,
    @Param('reservationId') reservationId: Types.ObjectId,
  ): Promise<any> {
    try {
      return await this.service.deleteReservation(req, {
        params: { reservationId },
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
