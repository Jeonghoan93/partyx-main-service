import { Listing } from '../schemas/listing.schema';
import { Reservation } from '../schemas/reservation.schema';
import { User } from '../schemas/user.schema';

export type SafeListing = Omit<Listing, 'createdAt' | 'user'> & {
  createdAt: string;
  user: SafeUser;
};

export type SafeReservation = Omit<
  Reservation,
  'createdAt' | 'startDate' | 'endDate' | 'listing'
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};

export type SafeUser = Omit<
  User,
  'createdAt' | 'updatedAt' | 'emailVerified'
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified?: string | null;
};

export enum userTypes {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export class ResponseDto<T> {
  constructor(
    public message: string,
    public result: {
      data: T;
      metadata?: any;
    },
    public success: boolean,
  ) {}
}

export class GenericResponseDto {
  constructor(
    public status: string,
    public message: string,
    public result: any,
  ) {}
}
