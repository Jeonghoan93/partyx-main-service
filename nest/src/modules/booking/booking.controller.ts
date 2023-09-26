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
import { Booking } from 'src/common/schemas/booking.schema';
import { SafeBooking } from 'src/common/types';
import { BookingService } from './booking.service';

@Controller('api/booking')
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Get()
  async getBookings(
    @Query() query: { eventID?: string; userID?: string; authorId?: string },
  ): Promise<SafeBooking[]> {
    try {
      return await this.service.getBookings(query);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Post()
  async createBooking(@Req() req: Request): Promise<Booking> {
    try {
      return await this.service.createBooking(req);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':bookingId')
  async deleteBooking(
    @Req() req: Request,
    @Param('bookingId') bookingId: Types.ObjectId,
  ): Promise<any> {
    try {
      return await this.service.deleteBooking(req, {
        params: { bookingId },
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
