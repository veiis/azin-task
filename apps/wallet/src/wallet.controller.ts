import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WalletService } from './wallet.service';
import { RmqService } from '@app/shared';

@Controller()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly rmqService: RmqService
  ) { }

  @EventPattern('get-balance')
  async getBalance(@Payload() params: any, @Ctx() context: RmqContext) {
    const result = await this.walletService.getBalance(params)
    this.rmqService.ack(context)
    return result
  }

  @EventPattern('add-money')
  async addMoney(@Payload() queries: any, @Ctx() context: RmqContext) {
    const result = await this.walletService.addMoney(queries)
    this.rmqService.ack(context)
    return result
  }
}
