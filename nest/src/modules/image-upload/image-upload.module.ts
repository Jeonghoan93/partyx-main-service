import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventRepository } from 'src/common/repos/event.repo';
import { Event, EventSchema } from 'src/common/schemas/event.schema';
import { License, LicenseSchema } from 'src/common/schemas/license.schema';
import { StripeService } from '../payment/stripe.service';
import { CloudinaryService } from './cloudinary.service';
import { ImageUploadController } from './image-upload.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
  ],
  controllers: [ImageUploadController],
  providers: [CloudinaryService, EventRepository, StripeService],
  exports: [CloudinaryService],
})
export class ImageUploadModule {}
