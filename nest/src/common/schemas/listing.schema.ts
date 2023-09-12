import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Reservation } from './reservation.schema';
import { User } from './user.schema';

@Schema()
export class Listing extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  imageSrc: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  category: string;

  @Prop()
  maxGuests: number;

  @Prop()
  minGuests: number;

  @Prop({ type: Object })
  location: {
    flag: string;
    label: string;
    latlng: [number, number];
    region: string;
    value: string;
  };

  @Prop()
  eventDate: string; // you might want to consider changing this to Date type if it's an actual date

  @Prop({ type: Object })
  eventTime: {
    hour: number;
    minute: number;
  };

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  user?: User;

  reservations?: Reservation[];
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
