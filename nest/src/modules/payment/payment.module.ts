import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';
import { StripeService } from './stripe.service';

const config = new ConfigService();
@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: config.get('stripe.secret_key'),
      apiVersion: '2023-08-16',
    }),
  ],
  controllers: [],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentModule {}
