import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');
  const host = configService.get<string>('HOST');

  await app.listen(port, async () => {
    console.info(`Application is running on: ${await app.getUrl()}/`);
  });
}
bootstrap();
