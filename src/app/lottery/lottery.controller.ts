import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LotteryService } from './lottery.service';
import { PolkadotjsService } from './../polkadotjs/polkadotjs.service';

import { SetupDto } from './dto/setup.dto';

@ApiTags('Lottery')
@Controller('lottery')
export class LotteryController {

  constructor(
    private readonly lotteryService: LotteryService,
    private readonly polkadotJsService: PolkadotjsService
  ) { }

  @Post("setup")
  async setup(@Body() setupDto: SetupDto) {
    try {
      const api = await this.polkadotJsService.connect();
      return this.lotteryService.setup(api, setupDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to setup lottery',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("start")
  async start() {
    try {
      const api = await this.polkadotJsService.connect();
      return this.lotteryService.start(api);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to start lottery',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("stop")
  async stop() {
    try {
      const api = await this.polkadotJsService.connect();
      return this.lotteryService.stop(api);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to stop lottery',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("get-lottery-setup")
  async getLotterySetup() {
    try {
      const api = await this.polkadotJsService.connect();
      return this.lotteryService.getLotterySetup(api);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to get lottery setup',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
