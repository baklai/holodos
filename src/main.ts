import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');
  const host = configService.get<string>('HOST');

  const telegramService = app.get(TelegramService);

  app.use(await telegramService.botLaunch());

  await app.listen(port, host, async () => {
    // await telegramService.botLaunch();
    console.info(`Application is running on: ${await app.getUrl()}/`);
  });
}
bootstrap();
