import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeModule } from 'nestjs-stripe';
import { AuthMiddleware } from 'src/common/middleware/auth';
import { RolesGuard } from 'src/common/middleware/roles.guard';
import { EventRepository } from 'src/common/repos/event.repo';
import { TicketRepository } from 'src/common/repos/ticket.repo';
import { UserRepository } from 'src/common/repos/user.repo';
import { Event, EventSchema } from 'src/common/schemas/event.schema';
import { License, LicenseSchema } from 'src/common/schemas/license.schema';
import { Ticket, TicketSchema } from 'src/common/schemas/ticket.schema';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

const config = new ConfigService();
@Module({
  controllers: [TicketController],
  providers: [
    TicketService,
    UserRepository,
    EventRepository,
    TicketRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    StripeModule.forRoot({
      apiKey: config.get('stripe.secret_key'),
      apiVersion: '2023-08-16',
    }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  ],
})
export class TicketModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: `${config.get('appPrefix')}/tickets/webhook`,
        method: RequestMethod.POST,
      })
      .forRoutes(TicketController);
  }
}
