import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: false,
  });
  app.use(bodyParser.json());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
