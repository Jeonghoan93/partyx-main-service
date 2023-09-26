import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from 'src/common/config/app.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BookingModule } from 'src/modules/booking/booking.module';
import { EmailVerificationModule } from 'src/modules/email-verification/email-verification.module';
import { EventModule } from 'src/modules/event/event.module';
import { FavoritesModule } from 'src/modules/favorites/favorites.module';
import { ImageUploadModule } from 'src/modules/image-upload/image-upload.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { ReviewModule } from 'src/modules/review/review.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
      }),
      inject: [ConfigService],
    }),
    UserModule,

    BookingModule,
    EventModule,
    EventModule,
    AuthModule,
    FavoritesModule,
    ImageUploadModule,
    EmailVerificationModule,
    PaymentModule,
    ReviewModule,
  ],
  providers: [],
})
export class AppModule {}
