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

  @Post(':eventId')
  async addToFavorites(
    @Req() req: Request,
    @Param('eventId') eventId: Types.ObjectId,
  ): Promise<User> {
    try {
      return await this.favoriteService.addToFavorites(req, {
        params: { eventId },
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Delete(':eventId')
  async deleteFromFavorites(
    @Req() req: Request,
    @Param('eventId') eventId: Types.ObjectId,
  ): Promise<User> {
    try {
      return await this.favoriteService.deleteFromFavorites(req, {
        params: { eventId },
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
