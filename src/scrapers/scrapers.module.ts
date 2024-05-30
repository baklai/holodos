import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from 'src/schemas/product.schema';

import { ScrapersService } from './scrapers.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  providers: [
    ScrapersService,
    {
      provide: 'BROWSER_OPTIONS',
      useValue: {
        headless: process.env.NODE_ENV === 'production' ? true : false,
        dumpio: process.env.NODE_ENV === 'production' ? false : true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true
      }
    }
  ],
  exports: [ScrapersService]
})
export class ScrapersModule {}
