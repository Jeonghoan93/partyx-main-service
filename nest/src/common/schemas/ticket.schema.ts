import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum paymentStatus {
  pending = 'pending',
  paid = 'paid',
  failed = 'failed',
}

export enum ticketStatus {
  pending = 'pending',
  completed = 'completed',
}

export class TicketedItems {
  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  skuCode: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  refundable: boolean;

  @Prop({ required: true })
  validity: number;

  @Prop({ required: true })
  skuPriceId: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ default: [] })
  licenses: string[];
}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, type: Object })
  customerAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };

  @Prop({ required: true })
  customerPhoneNumber: string;

  @Prop({ required: true })
  ticketedItems: TicketedItems[];

  @Prop({ required: true, type: Object })
  paymentInfo: {
    paymentMethod: string;
    paymentStatus: paymentStatus;
    paymentAmount: number;
    paymentDate: Date;
    paymentIntentId: string;
  };

  @Prop({ default: ticketStatus.pending })
  ticketStatus: ticketStatus;

  @Prop({ default: false })
  isTicketIssued: boolean;

  @Prop({ default: null })
  checkoutSessionId: string;
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);
