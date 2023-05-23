import { NestFactory } from '@nestjs/core';
import { WalletModule } from './wallet.module';
import { RmqService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(WalletModule);
  const rmqService = app.get<RmqService>(RmqService)

  app.connectMicroservice(rmqService.getOptions('WALLET_QUEUE'))

  app.startAllMicroservices()
}
bootstrap();
