import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Booking } from './booking.schema';
import { Review, ReviewSchema } from './review.schema';
import { User } from './user.schema';

@Schema()
export class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  postalCode: string;

  @Prop()
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema()
export class Location {
  @Prop({ type: [Number] })
  latlng: [number, number];
}

export const LocationSchema = SchemaFactory.createForClass(Location);

@Schema()
export class Event extends Document {
  @Prop()
  eventId: number;

  @Prop()
  img: string;

  @Prop()
  avgRating: number;

  @Prop()
  reviewCounts: number;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop({ type: LocationSchema })
  location?: Location;

  @Prop()
  title: string;

  @Prop()
  minGuests: number;

  @Prop()
  maxGuests: number;

  @Prop()
  desc: string;

  @Prop([String])
  offers: string[];

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  eventType: string;

  @Prop()
  currency: string;

  @Prop()
  price: number;

  @Prop()
  hostName: string;

  @Prop()
  hostProfilePhoto: string;

  @Prop()
  cancellationPolicy: string;

  @Prop([String])
  eventRules: string[];

  @Prop([String])
  safety: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop([ReviewSchema])
  reviews: Review[];

  @Prop([{ type: Types.ObjectId, ref: 'Booking' }])
  bookings?: Booking[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: User;
}

export const EventSchema = SchemaFactory.createForClass(Event);
