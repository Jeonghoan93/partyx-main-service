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
import { Event } from 'src/common/schemas/event.schema';
import { SafeEvent } from 'src/common/types';
import { EventService, IEventsParams } from './event.service';

@Controller('api/event')
export class EventController {
  constructor(private readonly service: EventService) {}
  @Post()
  async createEvent(@Req() req: Request): Promise<Event> {
    try {
      return await this.service.createEvent(req);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get(':eventId')
  async getEventById(@Param('eventId') eventId: string): Promise<SafeEvent> {
    try {
      const event = await this.service.getEventById({ eventId });
      if (!event) throw new NotFoundException('Event not found');
      return event;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Get()
  async getEvents(@Query() query: IEventsParams): Promise<SafeEvent[]> {
    try {
      return await this.service.getEvents(query);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Get('favorites')
  async getFavoriteEvents(@Req() req: Request): Promise<SafeEvent[]> {
    try {
      return await this.service.getFavoriteEvents(req);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Delete('favorites/:eventId')
  async deleteFavoriteEvent(
    @Req() req: Request,
    @Param('eventId') eventId: Types.ObjectId,
  ): Promise<Event> {
    try {
      return await this.service.deleteFavoriteEvent(req, {
        params: { eventId },
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':eventId')
  async deleteEvent(
    @Req() req: Request,
    @Param('eventId') eventId: Types.ObjectId,
  ): Promise<Event> {
    try {
      return await this.service.deleteEvent(req, {
        params: { eventId },
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
