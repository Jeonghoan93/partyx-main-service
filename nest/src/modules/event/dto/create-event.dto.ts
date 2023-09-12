import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  SkuDetails,
  baseType,
  eventType,
} from 'src/common/schemas/event.schema';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  imageDetails?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  @IsEnum(eventType)
  category?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(baseType)
  baseType?: string;

  @IsString()
  @IsNotEmpty()
  eventUrl?: string;

  @IsArray()
  @IsNotEmpty()
  highlights?: string[];

  @IsOptional()
  @IsArray()
  skuDetails?: SkuDetails[];

  @IsOptional()
  stripeEventId?: string;
}
