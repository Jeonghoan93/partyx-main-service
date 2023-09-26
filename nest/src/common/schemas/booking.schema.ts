import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from './event.schema';
import { User } from './user.schema';

@Schema()
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  bookBy: User;

  @Prop()
  bookingDate: Date;

  @Prop()
  numberOfTickets: number;

  @Prop()
  currency: string;

  @Prop()
  totalAmount: number;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  event: Event;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
