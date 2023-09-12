import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Account extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  type: string;

  @Prop()
  provider: string;

  @Prop()
  providerAccountId: string;

  @Prop()
  refresh_token?: string;

  @Prop()
  access_token?: string;

  @Prop()
  expires_at?: number;

  @Prop()
  token_type?: string;

  @Prop()
  scope?: string;

  @Prop()
  id_token?: string;

  @Prop()
  session_state?: string;

  user?: User;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
