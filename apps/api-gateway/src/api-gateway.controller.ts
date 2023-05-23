import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { GetBalanceDto } from './dto/get-balance.dto';
import { AddMoneyDto } from './dto/add-money.dto';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) { }

  @Get('get-balance/:userId')
  async getBalance(@Param() params: GetBalanceDto) {
    return await this.apiGatewayService.getBalance(params)
  }


  @Put('add-money')
  async addMoney(@Query() queries: AddMoneyDto) {
    return await this.apiGatewayService.addMoney(queries)
  }
}
