import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/common/middleware/roles.guard';
import { EventRepository } from 'src/common/repos/event.repo';
import { TicketRepository } from 'src/common/repos/ticket.repo';
import { Event, EventSchema } from 'src/common/schemas/event.schema';
import { License, LicenseSchema } from 'src/common/schemas/license.schema';
import { Ticket, TicketSchema } from 'src/common/schemas/ticket.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    EventRepository,
    TicketRepository,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class ReviewModule {}
