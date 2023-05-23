import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { startSeed } from '@app/shared/database/seeder';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const configService = app.get(ConfigService)
  const port = configService.get<string | number>('PORT')

  const seedStatus = configService.get<string>('SEEDING_ON_EVERY_RESTART') === "true" ? true : false

  await startSeed(seedStatus)

  await app.listen(port);
}
bootstrap();
