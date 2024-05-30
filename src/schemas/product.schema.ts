import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsMongoId, IsNumber, IsOptional, IsDate } from 'class-validator';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Product {
  @IsString()
  @IsMongoId()
  readonly id: string;

  @IsString()
  @Prop({ type: String, required: true })
  readonly img: string;

  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly title: string;

  @IsNumber()
  @Prop({ type: Number, required: true, default: 0 })
  readonly pricePer: number;

  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly priceTitle: string;

  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly market: string;

  @IsString()
  @Prop({
    type: String,
    trim: true,
    required: true
  })
  readonly categoryIcon: string;

  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly categoryName: string;

  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);
