import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotCommand } from 'telegraf/typings/core/types/typegram';
import { Telegraf } from 'telegraf';

import { TContext } from './telegram.module';

@Injectable()
export class TelegramService {
  constructor(
    readonly configService: ConfigService,
    @Inject('TELEGRAM_BOT') readonly bot: Telegraf<TContext>
  ) {}

  async botLaunch() {
    this.bot.launch();
  }

  async setBotMyCommands(commands: BotCommand[]) {
    this.bot.telegram.setMyCommands(commands);
  }

  async setBotCommand(command: string, handleCommand: Function) {
    this.bot.command(command, ctx => handleCommand(ctx));
  }
}
