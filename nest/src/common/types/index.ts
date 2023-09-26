import { Booking } from '../schemas/booking.schema';
import { Event } from '../schemas/event.schema';
import { User } from '../schemas/user.schema';

export type SafeEvent = Omit<Event, 'createdAt' | 'user'> & {
  createdAt: string;
  user: SafeUser;
};

export type SafeBooking = Omit<
  Booking,
  'createdAt' | 'startDate' | 'endDate' | 'event'
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  event: SafeEvent;
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
