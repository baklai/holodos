import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotCommand } from 'telegraf/typings/core/types/typegram';
import { Telegraf, Scenes } from 'telegraf';

import { TContext } from './telegram.module';

@Injectable()
export class TelegramService {
  private stage: Scenes.Stage<Scenes.SceneContext>;
  constructor(
    readonly configService: ConfigService,
    @Inject('TELEGRAM_BOT') readonly bot: Telegraf<TContext>
  ) {
    this.stage = new Scenes.Stage<Scenes.SceneContext>([], {
      ttl: 10
    });

    bot.use(this.stage.middleware());
  }

  async botLaunch() {
    this.bot.launch({
      webhook: {
        domain: this.configService.get<string>('WEB_APP')
        // port: this.configService.get<number>('PORT')
      }
    });
  }

  async setBotMyCommands(commands: BotCommand[]) {
    this.bot.telegram.setMyCommands(commands);
  }

  async setBotCommand(command: string, handler: Function) {
    this.bot.command(command, ctx => handler(ctx));
  }

  async sendMessage(userID: number, message: string) {
    return await this.bot.telegram.sendMessage(userID, message);
  }

  async setOnMessage(handler: Function) {
    this.bot.on('message', ctx => handler(ctx));
  }

  async setOnСallbackQuery(handler: Function) {
    this.bot.on('callback_query', ctx => handler(ctx));
  }

  async registerBotScene(scene: any) {
    this.stage.register(scene);
  }
}
