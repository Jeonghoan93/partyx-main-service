import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingRepository } from 'src/common/repos/listing.repo';
import { Listing, ListingSchema } from 'src/common/schemas/listing.schema';
import { AuthModule } from '../auth/auth.module';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Listing.name, schema: ListingSchema }]),
    AuthModule,
  ],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository],
  exports: [ListingService],
})
export class ListingModule {}
