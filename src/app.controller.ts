import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MARKETS } from './common/constants/markets.constant';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Post('bot*')
  statusTelegramBot(
    @Req() req: Record<string, any>,
    @Body() processUpdate: Record<string, any>
  ): any {
    const requestPath: string = req.url;
    if (requestPath.includes(`bot${this.configService.get<string>('telegramBotToken')}`)) {
      return this.appService.statusTelegramBot(processUpdate);
    } else {
      throw new Error('Invalid route');
    }
  }

  @Get('markets')
  async getMarkets(): Promise<Record<string, any>[]> {
    return MARKETS;
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
