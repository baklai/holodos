import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';

import { ScrapersService } from './scrapers.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  providers: [
    ScrapersService,
    {
      provide: 'BROWSER_OPTIONS',
      useValue: {
        headless: process.env.NODE_ENV === 'production' ? true : false,
        args: ['--no-sandbox']
      }
    }
  ],
  exports: [ScrapersService]
})
export class ScrapersModule {}
