import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/common/middleware/roles.guard';
import { EventRepository } from 'src/common/repos/event.repo';

import { Event, EventSchema } from 'src/common/schemas/event.schema';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    EventRepository,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class ReviewModule {}
