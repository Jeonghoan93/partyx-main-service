import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/common/repos/user.repo';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [FavoritesController],
  providers: [UserRepository, FavoritesService],
  exports: [],
})
export class FavoritesModule {}
