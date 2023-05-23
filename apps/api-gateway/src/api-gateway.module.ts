import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { DatabaseModule, RmqModule } from '@app/shared';
import { WALLET_SERVICE } from './constants/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'apps/wallet/src/entities/transaction.entity';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required()
      }),
      envFilePath: 'apps/api-gateway/.env',
    }),
    RmqModule.register({ name: WALLET_SERVICE }),
    DatabaseModule,
    TypeOrmModule.forFeature([Transaction]),
    ScheduleModule.forRoot()
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }
