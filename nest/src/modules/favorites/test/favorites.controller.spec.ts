import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { FavoritesController } from '../favorites.controller';
import { FavoritesService } from '../favorites.service';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  beforeEach(async () => {
    const mockFavoritesService = {
      addToFavorites: jest.fn(),
      deleteFromFavorites: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToFavorites', () => {
    it('should add a favorite and return the updated user', async () => {
      const user: User = {
        _id: new Types.ObjectId(),
        favoriteIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      (
        service.addToFavorites as jest.MockedFunction<
          typeof service.addToFavorites
        >
      ).mockResolvedValue(user);

      expect(
        await controller.addToFavorites({} as any, new Types.ObjectId()),
      ).toEqual(user);
    });

    it('should throw NotFoundException when the service throws an error', async () => {
      (
        service.addToFavorites as jest.MockedFunction<
          typeof service.addToFavorites
        >
      ).mockRejectedValue(new Error('Not Found'));

      await expect(
        controller.addToFavorites({} as any, new Types.ObjectId()),
      ).rejects.toThrowError('Not Found');
    });
  });

  describe('deleteFromFavorites', () => {
    it('should delete a favorite and return the updated user', async () => {
      const user: User = {
        _id: new Types.ObjectId(),
        favoriteIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      (
        service.deleteFromFavorites as jest.MockedFunction<
          typeof service.addToFavorites
        >
      ).mockResolvedValue(user);

      expect(
        await controller.deleteFromFavorites({} as any, new Types.ObjectId()),
      ).toEqual(user);
    });

    it('should throw NotFoundException when the service throws an error', async () => {
      (
        service.deleteFromFavorites as jest.MockedFunction<
          typeof service.addToFavorites
        >
      ).mockRejectedValue(new Error('Not Found'));

      await expect(
        controller.deleteFromFavorites({} as any, new Types.ObjectId()),
      ).rejects.toThrowError('Not Found');
    });
  });
});
