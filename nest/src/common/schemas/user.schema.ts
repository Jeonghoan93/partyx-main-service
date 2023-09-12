import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { userTypes } from '../types';
import { Account } from './account.schema';
import { Listing } from './listing.schema';
import { Reservation } from './reservation.schema';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  hashedPassword: string;

  @Prop()
  emailVerified?: Date;

  @Prop({ default: false })
  isEmailVerified?: boolean;

  @Prop()
  image?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Listing' }] })
  favoriteIds?: Types.ObjectId[];

  accounts?: Account[];

  listings?: Listing[];

  reservations?: Reservation[];

  @Prop({ type: Number })
  otp?: number;

  @Prop({ default: null })
  otpExpiryTime?: Date;

  @Prop({
    default: userTypes.CUSTOMER,
    enum: [userTypes.ADMIN, userTypes.CUSTOMER],
  })
  type?: string;

  reviews?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
