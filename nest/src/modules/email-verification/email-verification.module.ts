import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/common/middleware/roles.guard';
import { UserRepository } from 'src/common/repos/user.repo';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [EmailVerificationController],
  providers: [
    EmailVerificationService,
    UserRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class EmailVerificationModule {}
