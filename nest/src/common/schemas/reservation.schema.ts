import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Listing } from './listing.schema';
import { User } from './user.schema';

@Schema()
export class Reservation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Listing' })
  listingId: Types.ObjectId;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  totalPrice: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  user: User;

  listing: Listing;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
