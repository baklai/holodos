import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsMongoId, IsOptional, IsDate } from 'class-validator';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Category {
  @IsString()
  @IsMongoId()
  readonly id: string;

  @IsString()
  @Prop({
    type: String,
    trim: true,
    default:
      'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAFeElEQVRYhcWWe0xURxSHfzN3wV1ddgUsoLyWlRADQQS1FBKLCAgCq7YsilBbVFqTxthoaUIVn/WFNaWP1FaNLfYBVkBTARUFxag0ChWkICpaFOQNKrC4C7v3Tv/gUZGXjVLOn3O+mfPNzMncSzAKMVe1bJJI0B8GYRrGyBWeGh3Ly0hpHowlr7JwY9H7MwgRPm7VwG9/msbqQZ0gtGoYRyk0PI/Y3FNpB0ZNoKl45XoG8jkA+ux4ZS2PlDM6VnrPQMCwKedU2o5n89wrKV60MooRcgCDbMjUhMLbzYg0PGKobuB9HZycz1dW3KzqzdPnJ/zXqKyMFjNC9g3HcJQgZrEYcilhlGL7szmRX7B6NSFEDQCMQUsJCqmBP5SdfbzuRQQmPBHNA2FWI3GaDsBkPKFtHezNkJBI06ys5McAQAlBhFQ63t9jhqu/jbVlCAi2MSNRhV+wOvRFBBhlziMxheV6fPptO2qbBDAGqode2ZujADDVQYGEHZuQdPAbevi7RCgd7CUcJWm+qjCXEQ0EIh0qxQsMKdk6JP76FBZmFDFvSXqmMJM+AcZIe3NLi9A7YGtjjc+2xFGxWCwSCSR+RIFh4kiGDpmXOhHoZYxtq6WwMBvYciJKUFhb16CqflgDWxtrAMAkczN4zvbgLl75I6CHI/6hah8AfmBwBsAxY35V7okTLcMJeLsZYbaLEVwdRUMylBr4QwSkY9fer4Tmlkd9CWvryRB4wWx+aJgqcOGSO2C4wFG60d7WRvX6bI+F6UlJZYyx8+Pkbm8Mtfg0haiveHOrgN+ydQMYAgB+wepQjiPpYrFY5DnLgyrs7XDjrzJcLy4BACjs7fioiDDOy3MWxhkb91ugo/4knjacHO4gUFiux4E0LbSdDAIDQOCbk5mW1ycAAL6qMBeRQOIJRwMEXjAHAEIIopaGYXlkOCgd/MkYToAXGI6d60TmpU4opnAI8DTGwePafgJ9l3MhI70MwLKeE1lNCL5f9V4klqoXD7u74eJIhg65BV0I9DJGZJAEd6oMA5gB3bFgQZTMwHUluE93FZaELXqpl/L5JrQ0o7Awo9X1j1lFn4B/aPgaIrApEyeQrampqV0GrsuPCUwWsyKKENJ9QwaDAT8lpwIA3o0Mh0g0eFcbeCD9fHejhc0TY5qiP2cup0hcL/thza7WpoBg9S6A1YjAWBgjmNuqJfPnq8LDY5aHZ7nPnPXEUelgCgD1DY3YsScRtyvuAgCuF5UgPm4drCwt+i3e9FjA10d1uPdQDwAovStgbYQYr5n2P8S7D/mJrVqSzwibCZA8TunkHG1uZqoAYMnzfIzmqa75nQi1GgAu51/Fxq270d6uQVzsWvjM8cbZnDxknT4HG+vJsLO1gV5zG/nXSrH3iA4dOiPExX4EnzneyLn4J3Kv6TDZnMDaovujW1Cmxxe/aN2NjcdNkclMqFaru88pnZyjnRynKvZsj6elN8uNblfcU9XU1lVfzr/alvTzUbnC3o4l7NxEXJynwd7OBj5zvFBcUob03zNRU1tXXVBUwSdn1UuUDkok7NyMfzlvFJfcQtbFRjS0CNUFZfq2YzmdckelA7dv9zZaevMWGhqbugWsLC0Uby8KQWCAL9EbDMg6fU5eeb9KHhLkjy0bYolcJus7QhOpFIEBvujl/n7QLAkJ8sfmDbF4ngvq4c7klcur6nl5D0dkMhOczc1DQ2PT/X5dwnEcYqKj4O7mCgCY6T590GZ7ldyg7TzUgqPBvfQf0csGBYFGIpGMnYCBGK34ZN2HYyeQl5HSLDMxGZkcLYExq9wrMFe1bFJrW/vYCYiY/sd9X+4fOwEwSLVa7RgKjHGIAJJyo7Q0mRBy6P8s7B8S/gEIY/8ANOgjhy4mQ5AAAAAASUVORK5CYII='
  })
  readonly icon: string;

  @IsString()
  @IsOptional()
  @Prop({ type: String, trim: true })
  readonly title: string;

  @IsString()
  @IsOptional()
  @Prop({ type: String, trim: true })
  readonly catalog: string;

  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);
