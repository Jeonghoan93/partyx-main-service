import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Listing } from 'src/common/schemas/listing.schema';
import { SafeListing } from 'src/common/types';
import { ListingController } from '../listing.controller';
import { ListingService } from '../listing.service';

describe('ListingController', () => {
  let controller: ListingController;
  let service: ListingService;

  beforeEach(async () => {
    const mockListingService = {
      getListingById: jest.fn(),
      getListings: jest.fn(),
      getFavoriteListings: jest.fn(),
      deleteFavoriteListing: jest.fn(),
      createListing: jest.fn(),
      deleteListing: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingController],
      providers: [
        {
          provide: ListingService,
          useValue: mockListingService,
        },
      ],
    }).compile();

    controller = module.get<ListingController>(ListingController);
    service = module.get<ListingService>(ListingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get listing(s)', () => {
    it('should retrieve a listing by ID', async () => {
      const mockListing: SafeListing = {
        _id: new Types.ObjectId(),
        title: 'Test Listing',
        description: 'A test listing description',
        imageSrc: 'image.jpg',
        createdAt: '2021-01-01',
        category: 'Test',
        roomCount: 1,
        bathroomCount: 1,
        guestCount: 1,
        locationValue: 'Test Location',
        userId: new Types.ObjectId(),
        price: 100,
      } as SafeListing;
      (
        service.getListingById as jest.MockedFunction<
          typeof service.getListingById
        >
      ).mockResolvedValue(mockListing);

      const result = await controller.getListingById('mockId');
      expect(result).toEqual(mockListing);
    });

    it('should throw NotFoundException when listing not found', async () => {
      (
        service.getListingById as jest.MockedFunction<
          typeof service.getListingById
        >
      ).mockResolvedValue(undefined);

      await expect(controller.getListingById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should retrieve listings based on query', async () => {
      const mockListings: SafeListing[] = [
        {
          _id: new Types.ObjectId(),
          title: 'Test Listing',
          description: 'A test listing description',
          imageSrc: 'image.jpg',
          createdAt: '2021-01-01',
          category: 'Test',
          roomCount: 1,
          bathroomCount: 1,
          guestCount: 1,
          locationValue: 'Test Location',
          userId: new Types.ObjectId(),
          price: 100,
        },
      ] as SafeListing[];

      (
        service.getListings as jest.MockedFunction<typeof service.getListings>
      ).mockResolvedValue(mockListings);

      const result = await controller.getListings({});
      expect(result).toEqual(mockListings);
    });

    it('should retrieve favorite listings for a user', async () => {
      const mockListings: SafeListing[] = [
        {
          _id: new Types.ObjectId(),
          title: 'Test Listing',
          description: 'A test listing description',
          imageSrc: 'image.jpg',
          createdAt: '2021-01-01',
          category: 'Test',
          roomCount: 1,
          bathroomCount: 1,
          guestCount: 1,
          locationValue: 'Test Location',
          userId: new Types.ObjectId(),
          price: 100,
        },
      ] as SafeListing[];
      (
        service.getFavoriteListings as jest.MockedFunction<
          typeof service.getFavoriteListings
        >
      ).mockResolvedValue(mockListings);

      const result = await controller.getFavoriteListings({} as any);
      expect(result).toEqual(mockListings);
    });
  });

  describe('delete', () => {
    it('should delete a favorite listing', async () => {
      const mockListing: Listing = {
        _id: new Types.ObjectId(),
        title: 'Test Listing',
        description: 'A test listing description',
        imageSrc: 'image.jpg',
        createdAt: new Date(),
        category: 'Test',
        roomCount: 1,
        bathroomCount: 1,
        guestCount: 1,
        locationValue: 'Test Location',
        userId: new Types.ObjectId(),
        price: 100,
      } as Listing;
      (
        service.deleteFavoriteListing as jest.MockedFunction<
          typeof service.deleteFavoriteListing
        >
      ).mockResolvedValue(mockListing);

      const result = await controller.deleteFavoriteListing(
        {} as any,
        new Types.ObjectId(),
      );
      expect(result).toEqual(mockListing);
    });

    it('should throw BadRequestException on deletion failure', async () => {
      (
        service.deleteFavoriteListing as jest.MockedFunction<
          typeof service.deleteFavoriteListing
        >
      ).mockRejectedValue(new Error('Deletion failed'));

      await expect(
        controller.deleteFavoriteListing({} as any, new Types.ObjectId()),
      ).rejects.toThrow(BadRequestException);
    });

    it('should delete a listing by ID', async () => {
      const mockListing: Listing = {
        _id: new Types.ObjectId(),
        title: 'Test Listing',
        description: 'A test listing description',
        imageSrc: 'image.jpg',
        createdAt: new Date(),
        category: 'Test',
        roomCount: 1,
        bathroomCount: 1,
        guestCount: 1,
        locationValue: 'Test Location',
        userId: new Types.ObjectId(),
        price: 100,
      } as Listing;
      (
        service.deleteListing as jest.MockedFunction<
          typeof service.deleteListing
        >
      ).mockResolvedValue(mockListing);

      const result = await controller.deleteListing(
        {} as any,
        new Types.ObjectId(),
      );
      expect(result).toEqual(mockListing);
    });

    it('should throw BadRequestException on deletion failure', async () => {
      (
        service.deleteListing as jest.MockedFunction<
          typeof service.deleteListing
        >
      ).mockRejectedValue(new Error('Deletion failed'));

      await expect(
        controller.deleteListing({} as any, new Types.ObjectId()),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createListing', () => {
    it('should create a listing', async () => {
      const mockListing: Listing = {
        _id: new Types.ObjectId(),
        title: 'Test Listing',
        description: 'A test listing description',
        imageSrc: 'image.jpg',
        createdAt: new Date(),
        category: 'Test',
        roomCount: 1,
        bathroomCount: 1,
        guestCount: 1,
        locationValue: 'Test Location',
        userId: new Types.ObjectId(),
        price: 100,
      } as Listing;

      (
        service.createListing as jest.MockedFunction<
          typeof service.createListing
        >
      ).mockResolvedValue(mockListing);

      const result = await controller.createListing({} as any);
      expect(result).toEqual(mockListing);
    });

    it('should throw BadRequestException on creation failure', async () => {
      (
        service.createListing as jest.MockedFunction<
          typeof service.createListing
        >
      ).mockRejectedValue(new Error('Creation failed'));

      await expect(controller.createListing({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
