import { Injectable, NotFoundException } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { Transaction as TransactionModel } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private readonly walletEntity: Repository<Wallet>,
    @InjectRepository(TransactionModel) private readonly transactionEntity: Repository<TransactionModel>,
    @InjectRepository(User) private readonly userEntity: Repository<User>,
    private readonly dataSource: DataSource,
  ) { }


  async getBalance(params: any) {
    const { userId } = params

    // check if user exist - this should not be here. but just for demonstration purposes
    const user = await this.userEntity.findOne({ where: { id: userId } })
    if (!user) return { code: 404, message: 'user not found' }
    return await this.walletEntity.findOne({
      where: {
        user: { id: userId }
      },
      relations: { user: true },
      select: {
        id: true,
        balance: true,
        user: { id: true, name: true }
      }
    })
  }

  async addMoney(queries: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let { userId, amount } = queries

    const data = { status: 'not ok', referenceId: null }

    try {
      // check if user exist - this should not be here. but just for demonstration purposes
      const user = await this.userEntity.findOne({ where: { id: userId } })
      if (!user) return { code: 404, message: 'user not found' }

      let currentWallet = await this.dataSource.getRepository(Wallet).findOne({ where: { user: { id: userId } } })
      if (!currentWallet) {
        currentWallet = this.dataSource.getRepository(Wallet).create({ balance: 0, user: { id: userId } })
        await queryRunner.manager.save(currentWallet)
      }

      currentWallet.balance += amount

      await queryRunner.manager.getRepository(Wallet).save(currentWallet)

      const transactionStatus = amount < 0 ? 'decreased' : 'increased'
      const walletTransaction = await queryRunner.manager.getRepository(TransactionModel).save({ wallet: { id: currentWallet.id }, amount, user: { id: userId }, status: transactionStatus })

      data.status = 'ok'
      data.referenceId = walletTransaction.referenceId

      await queryRunner.commitTransaction();

      return data
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
