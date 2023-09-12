import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ListingRepository } from 'src/common/repos/listing.repo';
import { Listing } from 'src/common/schemas/listing.schema';
import { SafeListing } from 'src/common/types';
import { AuthService } from '../auth/auth.service';
import { CreateListingDTO } from './dto/create-listing.dto';

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

@Injectable()
export class ListingService {
  constructor(
    private readonly repo: ListingRepository,
    private readonly authService: AuthService,
  ) {}

  async createListing(req: Request): Promise<Listing> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const body: CreateListingDTO = await req.body;
    const {
      title,
      description,
      imageSrc,
      category,
      maxGuests,
      minGuests,
      location,
      price,
      eventDate,
      eventTime,
    } = body;

    Object.keys(body).forEach((value: any) => {
      if (!body[value]) {
        throw new Error(`${value} is required`);
      }
    });

    const newListing = await this.repo.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        roomCount: maxGuests,
        guestCount: minGuests,
        bathroomCount: null,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUser.result.user._id,
        eventDate,
        eventTime,
      },
    });

    return newListing;
  }

  async getListingById(params: { listingId?: string }): Promise<SafeListing> {
    try {
      const { listingId } = params;

      const listing = await this.repo.findOne({
        where: {
          _id: listingId,
        },
        include: {
          user: true,
        },
      });

      if (!listing) {
        return null;
      }

      return {
        ...listing.toObject(),
        createdAt: listing.createdAt.toISOString(),
        user: {
          ...listing.toObject().user.toObject(),
          createdAt: listing.user.createdAt.toISOString(),
          updatedAt: listing.user.updatedAt.toISOString(),
          emailVerified: listing.toObject().user.emailVerified
            ? listing.toObject().user.emailVerified.toISOString()
            : null,
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getListings(params: IListingsParams): Promise<SafeListing[]> {
    try {
      const {
        userId,
        roomCount,
        guestCount,
        bathroomCount,
        locationValue,
        startDate,
        endDate,
        category,
      } = params;

      const query: any = {};

      if (userId) {
        query.userId = userId;
      }

      if (roomCount) {
        query.roomCount = {
          $gte: +roomCount,
        };
      }

      if (guestCount) {
        query.guestCount = {
          $gte: +guestCount,
        };
      }

      if (bathroomCount) {
        query.bathroomCount = {
          $gte: +bathroomCount,
        };
      }

      if (locationValue) {
        query.locationValue = locationValue;
      }

      if (category) {
        query.category = category;
      }

      if (startDate && endDate) {
        query.reservations = {
          $not: {
            $elemMatch: {
              $or: [
                {
                  endDate: { $gte: startDate },
                  startDate: { $lte: startDate },
                },
                {
                  startDate: { $lte: endDate },
                  endDate: { $gte: endDate },
                },
              ],
            },
          },
        };
      }

      const listings = await this.repo.findMany({
        where: query,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const safeListings = listings.map((listing) => ({
        ...listing.toObject(),
        createdAt: listing.createdAt.toISOString(),
      }));

      return safeListings;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getFavoriteListings(req: Request): Promise<SafeListing[]> {
    try {
      const currentUser = await this.authService.getCurrentUser(req);

      if (!currentUser) {
        return [];
      }

      const favoriteListings = await this.repo.findMany({
        where: {
          _id: {
            $in: [...(currentUser.result.user.favoriteIds || [])],
          },
        },
      });

      const safeFavoriteListings = favoriteListings.map((listing) => ({
        ...listing.toObject(),
        createdAt: listing.createdAt.toISOString(),
      }));

      return safeFavoriteListings;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteFavoriteListing(
    req: Request,
    { params }: { params: { listingId: Types.ObjectId } },
  ): Promise<Listing> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const { listingId } = params;

    if (!listingId) {
      throw new Error('Invalid listing ID');
    }

    const listing = await this.repo.deleteListingByUser(
      listingId,
      currentUser.result.user._id,
    );

    return listing;
  }

  async deleteListing(
    req: Request,
    { params }: { params: { listingId: Types.ObjectId } },
  ): Promise<Listing> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const { listingId } = params;

    if (!listingId) {
      throw new Error('Invalid listing ID');
    }

    const listing = await this.repo.deleteListingByUser(
      listingId,
      currentUser.result.user._id,
    );

    return listing;
  }
}
