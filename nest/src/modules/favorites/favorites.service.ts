import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { UserRepository } from 'src/common/repos/user.repo';
import { User } from 'src/common/schemas/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async addToFavorites(
    req: Request,
    { params }: { params: { listingId: Types.ObjectId } },
  ): Promise<User> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const { listingId } = params;

    if (!listingId) {
      throw new Error('Invalid listing ID');
    }

    const favoriteIds = [...(currentUser.result.user.favoriteIds || [])];

    favoriteIds.push(listingId);

    const user = await this.userRepo.updateOneById(
      currentUser.result.user._id,
      {
        favoriteIds,
      },
    );

    return user;
  }

  async deleteFromFavorites(
    req: Request,
    { params }: { params: { listingId: Types.ObjectId } },
  ): Promise<User> {
    const currentUser = await this.authService.getCurrentUser(req);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const { listingId } = params;

    if (!listingId) {
      throw new Error('Invalid listing ID');
    }

    let favoriteIds = [...(currentUser.result.user.favoriteIds || [])];

    favoriteIds = favoriteIds.filter((id) => id !== listingId);

    const user = await this.userRepo.updateOneById(
      currentUser.result.user._id,
      {
        favoriteIds,
      },
    );

    return user;
  }
}
