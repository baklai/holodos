import { DynamicModule, Module } from '@nestjs/common';
import { Context, Telegraf, Telegram, session } from 'telegraf';
import { Update, UserFromGetMe } from 'telegraf/typings/core/types/typegram';

import { TelegramService } from './telegram.service';

export class TContext extends Context {
  userInfo?: Record<string, any>;
  constructor(update: Update, telegram: Telegram, botInfo: UserFromGetMe) {
    super(update, telegram, botInfo);
    this.userInfo = {
      userID: this.from.id,
      isBot: this.from.is_bot,
      firstName: this.from.first_name,
      lastName: this.from.last_name,
      username: this.from.username,
      languageCode: this.from.language_code
    };
  }
}

@Module({})
export class TelegramModule {
  static forRootAsync(options: {
    useFactory: (
      ...args: Record<string, any>[]
    ) => Promise<Record<string, any>> | Record<string, any>;
    imports?: any[];
    inject?: any[];
  }): DynamicModule {
    return {
      module: TelegramModule,
      imports: options.imports,
      providers: [
        {
          provide: 'TELEGRAM_BOT',
          useFactory: async (...args: Record<string, any>[]) => {
            const tgOptions = await options.useFactory(...args);

            /**  ADD PROXY AGENT
             * 
             * import { HttpsProxyAgent } from 'https-proxy-agent';

             * const { HTTPS_PROXY_HOST, HTTPS_PROXY_PORT } = process.env;
 
             * const agent = new HttpsProxyAgent({
             *    host: HTTPS_PROXY_HOST,
             *    port: HTTPS_PROXY_PORT
             *  });

             * const bot = new Telegraf(token, { telegram: { agent } });

             * If you want to use agent for fetching files, as well, use:
             * const bot = new Telegraf(BOT_TOKEN, { telegram: { agent, attachmentAgent: agent } })
             * 
             */

            const bot = new Telegraf(tgOptions.token, { contextType: TContext });

            bot.use(session());

            bot.use(async (ctx: TContext, next) => {
              const start = Date.now();
              await next();
              const ms = Date.now() - start;
              console.info(
                `LOG [BOT] DATE [${new Date().toLocaleString()}] USER [${ctx.userInfo.username}] ID [${ctx.userInfo.userID}] RESPONSE TIME [%sms]`,
                ms
              );
            });

            // Enable graceful stop
            process.once('SIGINT', () => bot.stop('SIGINT'));
            process.once('SIGTERM', () => bot.stop('SIGTERM'));

            return bot;
          },
          inject: options.inject || []
        },
        TelegramService
      ],
      exports: ['TELEGRAM_BOT', TelegramService]
    };
  }
}
