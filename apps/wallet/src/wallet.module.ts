import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { DatabaseModule } from '@app/shared/database/database.module';
import { RmqModule, RmqService } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/wallet/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_WALLET_QUEUE: Joi.string().required()
      }),
    }),
    RmqModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Wallet, Transaction, User]),
  ],
  controllers: [WalletController],
  providers: [WalletService, RmqService],
})

export class WalletModule { }
