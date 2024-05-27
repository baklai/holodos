import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { Product } from './schemas/product.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Post('bot*')
  statusTelegramBot(@Req() req: Request, @Body() processUpdate: Record<string, any>): any {
    const requestPath: string = req.url;
    if (requestPath.includes(`bot${this.configService.get<string>('telegramBotToken')}`)) {
      return this.appService.statusTelegramBot(processUpdate);
    } else {
      throw new Error('Invalid route');
    }
  }

  @Get('products')
  async getProducts(@Query() query: Record<string, any>): Promise<Record<string, any>[]> {
    return await this.appService.findAllProduct(query);
  }

  @Get('categories')
  async getCategories(@Query() query: Record<string, any>): Promise<Record<string, any>[]> {
    return await this.appService.findAllCategory(query);
  }
}
