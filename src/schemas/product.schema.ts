import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsMongoId, IsNumber, IsOptional, IsDate } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

import { Category } from './category.schema';

@Schema()
export class Product {
  @IsString()
  @IsMongoId()
  readonly id: string;

  @IsString()
  @Prop({ type: Buffer, required: true })
  readonly img: Buffer;

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
  @IsMongoId()
  @IsOptional()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
    autopopulate: true
  })
  readonly category: Category;

  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);
