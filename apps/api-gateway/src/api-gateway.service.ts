import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WALLET_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { GetBalanceDto } from './dto/get-balance.dto';
import { lastValueFrom } from 'rxjs';
import { AddMoneyDto } from './dto/add-money.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'apps/wallet/src/entities/transaction.entity';
import { User } from 'apps/wallet/src/entities/user.entity';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject(WALLET_SERVICE) private walletClient: ClientProxy,
    @InjectRepository(Transaction) private readonly transactionEntity: Repository<Transaction>,
  ) { }
  private readonly logger = new Logger(ApiGatewayService.name);

  async getBalance(params: GetBalanceDto) {
    try {
      const serviceResponse = await lastValueFrom(this.walletClient.send('get-balance', params))
      if (serviceResponse.code === 404) {
        throw new NotFoundException(serviceResponse)
      }
      return { status: 'ok', result: serviceResponse }
    } catch (err) {
      throw err
    }
  }

  async addMoney(queries: AddMoneyDto) {
    try {
      const serviceResponse = await lastValueFrom(this.walletClient.send('add-money', queries))
      if (serviceResponse.code === 404) {
        throw new NotFoundException(serviceResponse)
      }
      return serviceResponse
    } catch (err) {
      throw err
    }
  }

  @Cron("0 0 * * *")
  async handleCron() {
    const result = await this.transactionEntity.createQueryBuilder('transaction').select('SUM(transaction.amount)', 'total').getRawOne()
    this.logger.log(`Total Transactions: ${result.total}`);
  }
}
