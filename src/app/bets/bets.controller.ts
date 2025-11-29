import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BetsService } from './bets.service';
import { PolkadotjsService } from './../polkadotjs/polkadotjs.service';

import { AddBetDto } from './dto/add-bet.dto';

@ApiTags('Bets')
@Controller('bets')
export class BetsController {

  constructor(
    private readonly betsService: BetsService,
    private readonly polkadotJsService: PolkadotjsService
  ) { }

  @Post("add-bet")
  async addBet(@Body() addBetDto: AddBetDto) {
    try {
      const api = await this.polkadotJsService.connect();
      return this.betsService.addBet(api, addBetDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to add bet',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("get-bets/:draw_number")
  async getBets(@Param('draw_number') draw_number: number) {
    try {
      const api = await this.polkadotJsService.connect();
      return this.betsService.getBets(api, draw_number);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to get bets',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
