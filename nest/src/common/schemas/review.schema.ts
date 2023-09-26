import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Review {
  @Prop()
  rating: number;

  @Prop()
  reviewId: number;

  @Prop()
  reviewDesc: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  reviewDate: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
