import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class License {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
  })
  event: string;

  @Prop({
    required: true,
    type: String,
  })
  eventSku: string;
  @Prop({
    required: true,
    type: String,
  })
  licenseKey: string;
  @Prop({
    default: false,
    type: Boolean,
  })
  isSold: boolean;

  @Prop({
    default: '',
  })
  ticketId: string;
}

export const LicenseSchema = SchemaFactory.createForClass(License);
