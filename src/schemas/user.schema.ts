import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsMongoId, IsBoolean, IsOptional, IsDate, IsNumber } from 'class-validator';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @IsString()
  @IsMongoId()
  readonly id: string;

  @IsNumber()
  @Prop({ type: Number, required: true, unique: true })
  readonly userID: number;

  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, default: false })
  readonly isBot: boolean;

  @IsString()
  @IsOptional()
  @Prop({ type: String, trim: true })
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @Prop({ type: String, trim: true })
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @Prop({ type: String, trim: true })
  readonly username: string;

  @IsString()
  @IsOptional()
  @Prop({ type: String, trim: true })
  readonly languageCode: string;

  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, default: false })
  readonly isAdmin: boolean;

  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
