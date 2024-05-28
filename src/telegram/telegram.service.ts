import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotCommand } from 'telegraf/typings/core/types/typegram';
import { Telegraf, Scenes } from 'telegraf';
import { createServer } from 'http';

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
    // createServer(
    //   await this.bot.createWebhook({ domain: this.configService.get<string>('WEB_APP') })
    // ).listen(this.configService.get<number>('PORT'));

    this.bot.launch({
      webhook: {
        // Public domain for webhook; e.g.: example.com
        domain: this.configService.get<string>('WEB_APP'),

        // Port to listen on; e.g.: 8080
        port: 443, // this.configService.get<number>('PORT'),

        // Optional path to listen for.
        // `bot.secretPathComponent()` will be used by default
        path: '/webhook'

        // Optional secret to be sent back in a header for security.
        // e.g.: `crypto.randomBytes(64).toString("hex")`
        // secretToken: randomAlphaNumericString
      }
    });

    // this.bot.launch({
    //   webhook: {
    //     domain: this.configService.get<string>('WEB_APP')
    //     // port: this.configService.get<number>('PORT')
    //   }
    // });
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
