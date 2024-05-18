import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  readonly userID: number;

  @IsBoolean()
  @IsOptional()
  readonly isBot: boolean;

  @IsString()
  @IsOptional()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly languageCode: string;

  @IsBoolean()
  @IsOptional()
  readonly isAdmin: boolean;
}
