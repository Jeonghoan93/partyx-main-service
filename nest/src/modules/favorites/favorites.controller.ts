import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { FavoritesService } from './favorites.service';

@Controller('api/favorites')
export class FavoritesController {
  constructor(private readonly favoriteService: FavoritesService) {}

  @Post(':listingId')
  async addToFavorites(
    @Req() req: Request,
    @Param('listingId') listingId: Types.ObjectId,
  ): Promise<User> {
    try {
      return await this.favoriteService.addToFavorites(req, {
        params: { listingId },
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Delete(':listingId')
  async deleteFromFavorites(
    @Req() req: Request,
    @Param('listingId') listingId: Types.ObjectId,
  ): Promise<User> {
    try {
      return await this.favoriteService.deleteFromFavorites(req, {
        params: { listingId },
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
