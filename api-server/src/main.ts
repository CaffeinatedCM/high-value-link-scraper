import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' }, // Because this isn't for prod
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
