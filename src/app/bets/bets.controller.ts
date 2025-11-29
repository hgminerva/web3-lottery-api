import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BetsService } from './bets.service';
import { PolkadotjsService } from './../polkadotjs/polkadotjs.service';

import { AddBetDto } from './dto/add-bet.dto';
import { GetBetsDto } from './dto/get-bets.dto';

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

  @Post("get-bets")
  async getBets(@Body() getBetsDto: GetBetsDto) {
    try {
      const api = await this.polkadotJsService.connect();
      return this.betsService.getBets(api, getBetsDto);
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
