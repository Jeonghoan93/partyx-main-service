import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

export enum eventType {
  festival = 'Festival',
  clubEvent = 'Club Event',
  rave = 'Rave',
  houseParty = 'House Party',
  concert = 'Concert',
}

export enum baseType {
  business = 'Business',
  individual = 'Individual',
}

@Schema({ timestamps: true })
export class Feedback extends mongoose.Document {
  @Prop({})
  customerId: string;

  @Prop({})
  customerName: string;

  @Prop({})
  rating: number;

  @Prop({})
  feedbackMsg: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

@Schema({ timestamps: true })
export class SkuDetails extends mongoose.Document {
  @Prop({})
  skuName: string;

  @Prop({})
  price: number;

  @Prop({})
  validity: number; // in days

  @Prop({})
  lifetime: boolean;

  @Prop({})
  stripePriceId: string;

  @Prop({})
  skuCode?: string;
}

export const skuDetailsSchema = SchemaFactory.createForClass(SkuDetails);

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  organizer: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  attendees: Types.ObjectId[];

  @Prop({ required: true })
  maxAttendees: number;

  @Prop({ required: true })
  coverImage: string;

  @Prop({
    default: '',
  })
  image?: string;

  @Prop({
    required: true,
    enum: [
      eventType.rave,
      eventType.clubEvent,
      eventType.festival,
      eventType.houseParty,
      eventType.concert,
    ],
  })
  type: string;

  @Prop({ required: true, enum: [baseType.individual, baseType.business] })
  baseType: string;

  @Prop({ required: true })
  eventUrl: string;

  @Prop({ required: true })
  downloadUrl: string;

  @Prop({})
  avgRating: number;

  @Prop([{ type: FeedbackSchema }])
  feedbackDetails: Feedback[];

  @Prop([{ type: skuDetailsSchema }])
  skuDetails: SkuDetails[];

  @Prop({ type: Object })
  imageDetails: Record<string, any>;

  @Prop({})
  requirementSpecification: Record<string, any>[];

  @Prop({})
  highlights: string[];

  @Prop({})
  stripeEventId: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
