import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, PaginateModel, PaginateResult } from 'mongoose';

import { User } from './schemas/user.schema';
import { Category } from './schemas/category.schema';
import { Product } from './schemas/product.schema';

import { TelegramService } from './telegram/telegram.service';
import { TContext } from './telegram/telegram.module';

import { MAIN_COMMANDS, OPERATION_COMMANDS, SYSTEM_COMMANDS } from './common/bot/commands.bot';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginateQueryDto } from './dto/paginate-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Category.name) private readonly categoryModel: PaginateModel<Category>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly telegramService: TelegramService,
    private readonly configService: ConfigService
  ) {
    this.telegramService.setBotMyCommands([
      ...MAIN_COMMANDS.commands,
      ...OPERATION_COMMANDS.commands
    ]);

    this.telegramService.setBotCommand('start', (ctx: TContext) => this.handleCommandStart(ctx));
    this.telegramService.setBotCommand('help', (ctx: TContext) => this.handleCommandHelp(ctx));
    this.telegramService.setBotCommand('about', (ctx: TContext) => this.handleCommandAbout(ctx));
    this.telegramService.setBotCommand('donate', (ctx: TContext) => this.handleCommandDonate(ctx));
    this.telegramService.setBotCommand('statistic', (ctx: TContext) =>
      this.handleCommandStatistic(ctx)
    );

    this.telegramService.botLaunch();
  }

  statusTelegramBot(processUpdate: Record<string, any>): Record<string, any> {
    return processUpdate;
  }

  private async handleCommandStart(ctx: TContext) {
    const message = [
      `👋👋👋 <b><i>${ctx.userInfo.firstName}</i>, мої вітання</b>!`,
      '\n\n',
      '☝️ Дослідження підтверджують, що покупці зі списком продуктів та покупок витрачають на 15-30% менше грошей у магазинах! ',
      'Грамотно спланований похід до магазину збереже ваш час і позбавить від придбання непотрібних товарів.',
      '\n\n',
      '<i>💪 Я допоможу зробити процес походу до магазину простіше, швидше та найголовніше, ефективніше.</i>',
      '\n\n',
      '👉 Надішліть <b>/help</b> для перегляду списку команд',
      '\n\n\n',
      '🚧 <b>Відкрий холодос, для початку</b> 👇'
    ];

    await ctx.replyWithHTML(message.join(''), {
      link_preview_options: { is_disabled: true },
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: 'Відкрити холодос',
              web_app: { url: this.configService.get<string>('WEB_APP_URI') }
            }
          ],
          [{ text: '❓ Help' }, { text: '💸 Donate' }]
        ]
      }
    });

    const { userID } = ctx.userInfo;

    const user = await this.userModel.findOne({ userID });

    if (user) {
      return await this.userModel.findByIdAndUpdate(user.id, { ...ctx.userInfo });
    } else {
      return await this.userModel.create({ ...ctx.userInfo });
    }
  }

  private async handleCommandHelp(ctx: TContext) {
    const message = [
      `👋👋👋 <b><i>${ctx.userInfo.firstName}</i>, мої вітання</b>!`,
      '\n\n',
      '☝️ Я можу допомогти Вам створити та керувати списком товарів. Ви можете керувати мною, надіславши наступні команди:',
      '\n\n',
      `${MAIN_COMMANDS.commands.map(item => `/${item.command} - ${item.description}`).join('\n')}\n\n`,
      `<b><i>${OPERATION_COMMANDS.description}</i></b>\n`,
      `${OPERATION_COMMANDS.commands.map(item => `/${item.command} - ${item.description}`).join('\n')}\n\n`
    ];

    const user = await this.userModel.findOne({ userID: ctx.userInfo.userID });

    if (user?.isAdmin) {
      message.push(
        `<b><i>${SYSTEM_COMMANDS.description}</i></b>\n`,
        `${SYSTEM_COMMANDS.commands.map(item => `/${item.command} - ${item.description}`).join('\n')}`
      );
    }

    message.push('\n\n\n', '🚧 <b>Відкрий холодос, для початку</b> 👇');

    await ctx.replyWithHTML(message.join(''), {
      link_preview_options: { is_disabled: true },
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: 'Відкрити холодос',
              web_app: { url: this.configService.get<string>('WEB_APP_URI') }
            }
          ],
          [{ text: '❓ Help' }, { text: '💸 Donate' }]
        ]
      }
    });
  }

  private async handleCommandAbout(ctx: TContext) {
    const message = [
      `👋👋👋 <b><i>${ctx.userInfo.firstName}</i>, мої вітання</b>!`,
      '\n\n',
      '☝️ <b><i>Холодос</i></b> - це бот, що робить процес походу до магазину простіше, швидше, і найголовніше, ефективніше. Завдяки боту Ви зможете:',
      '\n\n',
      '🔸 <i>швидко створювати та керувати списками покупок, робити їх доступними близьким та знайомим;</i>',
      '\n',
      '🔸 <i>використовувати списки товарів та актуальні ціни найпопулярніших мереж супермаркетів;</i>',
      '\n',
      '🔸 <i>зберігати в чаті сформовані списки, і у Вас у будь-який час є до них доступ як із телефону, із додатку, так і через веб-сайт;</i>',
      '\n\n\n',
      '👉 Надішліть <b>/help</b> для перегляду списку команд',
      '\n\n\n',
      `✌️ Created by <a href=\"${'https://t.me/baklai'}\">Dmitrii Baklai</a> © ${new Date().getFullYear()}.`
    ];

    await ctx.replyWithHTML(message.join(''), {
      link_preview_options: { is_disabled: true },
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: 'Відкрити холодос',
              web_app: { url: this.configService.get<string>('WEB_APP_URI') }
            }
          ],
          [{ text: '❓ Help' }, { text: '💸 Donate' }]
        ]
      }
    });
  }

  private async handleCommandDonate(ctx: TContext) {
    const message = [
      `👋👋👋 <b><i>${ctx.userInfo.firstName}</i>, мої вітання</b>!`,
      '\n\n',
      '👌 Добре, якщо ви вирішили підтримати розвиток боту то не зупиняйтесь!',
      '\n\n',
      '<i>👉 Будь ласка, натисніть кнопку у повідомлені 👇</i>',
      '\n\n',
      '👉 Надішліть <b>/help</b> для перегляду списку команд',
      '\n\n',
      `✌️ Created by <a href=\"${'https://t.me/baklai'}\">Dmitrii Baklai</a> © ${new Date().getFullYear()}.`
    ];

    await ctx.replyWithHTML(message.join(''), {
      link_preview_options: { is_disabled: true },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '💸 DONATE FOR BOT',
              url: this.configService.get<string>('DONATE_URI')
            }
          ]
        ]
      }
    });
  }

  private async handleCommandStatistic(ctx: TContext) {
    const [usersCount, categoriesCount, productsCount] = await Promise.all([
      this.userModel.countDocuments(),
      this.categoryModel.countDocuments(),
      this.productModel.countDocuments()
    ]);

    const message = [
      `👋👋👋 <b><i>${ctx.userInfo.firstName}</i>, мої вітання</b>!`,
      '\n\n',
      '📊 <b>Статистика додатку:</b>',
      '\n',
      `<i> 🔹 Кількість користувачів: ${usersCount}</i>`,
      '\n',
      `<i> 🔹 Кількість категорій товарів: ${categoriesCount}</i>`,
      '\n',
      `<i> 🔹 Кількість товарів у категоріях: ${productsCount}</i>`,
      '\n\n',
      '👉 Надішліть <b>/help</b> для перегляду списку команд'
    ];

    await ctx.replyWithHTML(message.join(''), {
      link_preview_options: { is_disabled: true },
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: 'Відкрити холодос',
              web_app: { url: this.configService.get<string>('WEB_APP_URI') }
            }
          ],
          [{ text: '❓ Help' }, { text: '💸 Donate' }]
        ]
      }
    });
  }

  async findAllUser(): Promise<User[]> {
    return await this.userModel.find({});
  }

  async findOneUser(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async createOneUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto);
  }

  async updateOneUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, { $set: { ...updateUserDto } });
  }

  async removeOneUser(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }

  async findAllCategory(query: PaginateQueryDto): Promise<PaginateResult<Category>> {
    const { offset = 0, limit = 5, sort = {}, filters = {} } = query;

    return await this.categoryModel.paginate(
      { ...filters },
      {
        sort,
        offset,
        limit,
        lean: false,
        allowDiskUse: true
      }
    );
  }

  async findOneCategory(id: string): Promise<Category> {
    return await this.categoryModel.findById(id);
  }

  async createOneCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryModel.create(createCategoryDto);
  }

  async updateOneCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return await this.categoryModel.findByIdAndUpdate(id, { $set: { ...updateCategoryDto } });
  }

  async removeOneCategory(id: string) {
    const isDeleted = await this.categoryModel.deleteOne({ _id: id });
    if (isDeleted) {
      await this.productModel.deleteMany({ category: id });
    }
    return isDeleted;
  }

  async findAllProduct(query: PaginateQueryDto): Promise<PaginateResult<Product>> {
    const { offset = 0, limit = 5, sort = {}, filters = {} } = query;

    return;

    // return await this.productModel.paginate(
    //   { ...filters },
    //   {
    //     sort,
    //     offset,
    //     limit,
    //     lean: false,
    //     allowDiskUse: true
    //   }
    // );
  }

  async findOneProduct(id: string): Promise<Product> {
    return await this.productModel.findById(id);
  }

  async createOneProduct(createProductDto: CreateProductDto): Promise<Product> {
    return await this.productModel.create(createProductDto);
  }

  async updateOneProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, { $set: { ...updateProductDto } });
  }

  async removeOneProduct(id: string) {
    return await this.productModel.deleteOne({ _id: id });
  }
}
