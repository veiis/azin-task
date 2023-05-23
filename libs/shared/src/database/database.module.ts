import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "apps/wallet/src/entities/user.entity";
import { Wallet } from "apps/wallet/src/entities/wallet.entity";
import { Transaction } from "apps/wallet/src/entities/transaction.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('PG_URL'),
                synchronize: true,
                autoLoadEntities: true,
                entities: [User, Wallet, Transaction],
            }),
            inject: [ConfigService]
        })
    ]
})

export class DatabaseModule { }