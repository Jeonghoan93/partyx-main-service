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
import { Listing } from 'src/common/schemas/listing.schema';
import { SafeListing } from 'src/common/types';
import { IListingsParams, ListingService } from './listing.service';

@Controller('api/listing')
export class ListingController {
  constructor(private readonly service: ListingService) {}
  @Post()
  async createListing(@Req() req: Request): Promise<Listing> {
    try {
      return await this.service.createListing(req);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get(':listingId')
  async getListingById(
    @Param('listingId') listingId: string,
  ): Promise<SafeListing> {
    try {
      const listing = await this.service.getListingById({ listingId });
      if (!listing) throw new NotFoundException('Listing not found');
      return listing;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Get()
  async getListings(@Query() query: IListingsParams): Promise<SafeListing[]> {
    try {
      return await this.service.getListings(query);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Get('favorites')
  async getFavoriteListings(@Req() req: Request): Promise<SafeListing[]> {
    try {
      return await this.service.getFavoriteListings(req);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Delete('favorites/:listingId')
  async deleteFavoriteListing(
    @Req() req: Request,
    @Param('listingId') listingId: Types.ObjectId,
  ): Promise<Listing> {
    try {
      return await this.service.deleteFavoriteListing(req, {
        params: { listingId },
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':listingId')
  async deleteListing(
    @Req() req: Request,
    @Param('listingId') listingId: Types.ObjectId,
  ): Promise<Listing> {
    try {
      return await this.service.deleteListing(req, {
        params: { listingId },
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
