import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/common/middleware/roles.guard';
import { EventRepository } from 'src/common/repos/event.repo';
import { TicketRepository } from 'src/common/repos/ticket.repo';
import { UserRepository } from 'src/common/repos/user.repo';
import { Event, EventSchema } from 'src/common/schemas/event.schema';
import { License, LicenseSchema } from 'src/common/schemas/license.schema';
import { Ticket, TicketSchema } from 'src/common/schemas/ticket.schema';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { UserModule } from 'src/modules/user/user.module';
import { ImageUploadModule } from '../image-upload/image-upload.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

const config = new ConfigService();

@Module({
  controllers: [EventController],
  providers: [
    EventService,
    EventRepository,
    UserRepository,
    TicketRepository,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    UserModule,
    AuthModule,
    PaymentModule,
    ImageUploadModule,
  ],
})
export class EventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthService)
      .exclude(
        {
          path: `${config.get('appPrefix')}/events`,
          method: RequestMethod.GET,
        },
        {
          path: `${config.get('appPrefix')}/events/:id`,
          method: RequestMethod.GET,
        },
      )
      .forRoutes(EventController);
  }
}
