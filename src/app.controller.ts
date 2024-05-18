import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginateResult } from 'mongoose';

import { AppService } from './app.service';

import { Category } from './schemas/category.schema';
import { PaginateQueryDto } from './dto/paginate-query.dto';

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

  @Get('categories')
  async getCategories(@Query() query: PaginateQueryDto): Promise<PaginateResult<Category>> {
    return await this.appService.findAllCategory(query);
  }

  //   @Get('categories/:id')
  //  async getProductsByCategoryId(@Param('id') id: string): Promise<Product[]> {
  //     return await this.categoriesService.getProductsByCategoryId(id);
  //   }
}
