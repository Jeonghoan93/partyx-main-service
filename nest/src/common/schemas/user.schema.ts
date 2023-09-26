import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Booking, BookingSchema } from './booking.schema';
import { Address, AddressSchema, EventSchema } from './event.schema';
import { Review, ReviewSchema } from './review.schema';

export enum UserTypes {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Schema()
export class BankDetails {
  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string;

  @Prop({ required: false })
  routingNumber?: string;

  @Prop({ required: false })
  IBAN?: string;

  @Prop({ required: false })
  BIC?: string;
}

export const BankDetailsSchema = SchemaFactory.createForClass(BankDetails);

@Schema()
export class Notification {
  @Prop()
  id: number;

  @Prop({ type: String, enum: ['message', 'booking', 'review', 'system'] })
  type: string;

  @Prop()
  content: string;

  @Prop()
  date: Date;

  @Prop()
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

@Schema()
export class UserProfile {
  @Prop()
  bio: string;

  @Prop()
  profilePicture: string;

  @Prop()
  verified: boolean;

  @Prop()
  joinDate: Date;

  @Prop([ReviewSchema])
  ratingsReceived: Review[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

@Schema()
export class UserPreferences {
  @Prop()
  receiveNotifications: boolean;

  @Prop()
  language: string;
}

export const UserPreferencesSchema =
  SchemaFactory.createForClass(UserPreferences);

@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  recipient: Types.ObjectId;

  @Prop()
  content: string;

  @Prop()
  dateSent: Date;

  @Prop()
  read: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema()
export class User extends Document {
  @Prop()
  userId: number;

  @Prop()
  name: string;

  @Prop({ required: false })
  img?: string;

  @Prop()
  email: string;

  @Prop()
  hashedPassword: string;

  @Prop({ required: false })
  emailVerified?: Date;

  @Prop({ required: false, default: false })
  isEmailVerified?: boolean;

  @Prop({ required: false })
  createdAt?: Date;

  @Prop({ required: false })
  updatedAt?: Date;

  @Prop({ type: [Types.ObjectId], required: false })
  favoriteIds?: Types.ObjectId[];

  @Prop({ type: [EventSchema], required: false })
  events?: Event[];

  @Prop({ type: String, enum: UserTypes, required: false })
  type?: UserTypes;

  @Prop({ type: [ReviewSchema], required: false })
  reviews?: Review[];

  @Prop()
  phoneNumber: string;

  @Prop({ type: AddressSchema, required: false })
  address?: Address;

  @Prop({ type: BankDetailsSchema, required: false })
  bankDetails?: BankDetails;

  @Prop()
  isHost: boolean;

  @Prop({ type: [EventSchema], required: false })
  listings?: Event[];

  @Prop({ type: [BookingSchema], required: false })
  bookings?: Booking[];

  @Prop({ type: [NotificationSchema] })
  notifications: Notification[];

  @Prop({ type: UserProfileSchema })
  userProfile: UserProfile;

  @Prop({ type: UserPreferencesSchema })
  userPreferences: UserPreferences;

  @Prop({ type: [EventSchema], required: false })
  savedEvents?: Event[];

  @Prop({ type: [MessageSchema] })
  messages: Message[];

  @Prop({ type: [EventSchema], required: false })
  pastEventsAttended?: Event[];

  @Prop({ type: Object, required: false })
  verfication?: {
    otp: number;
    otpExpiryTime: Date;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
