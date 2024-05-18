import { Transform } from 'class-transformer';
import { IsInt, IsObject, IsOptional, Max, Min } from 'class-validator';

function convertValuesToNumber(val: Record<string, any>) {
  const obj = { ...val };
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        obj[key] = numericValue;
      }
    }
  }
  return obj;
}

export class PaginateQueryDto {
  @Min(0)
  @Max(50)
  @IsInt()
  readonly limit: number;

  @Min(0)
  @IsInt()
  readonly offset: number;

  @IsObject()
  @IsOptional()
  @Transform(({ value }) => (value ? convertValuesToNumber(value) : {}))
  readonly sort: Record<number | string, any>;

  @IsObject()
  @IsOptional()
  readonly filters: Record<string, any>;
}
