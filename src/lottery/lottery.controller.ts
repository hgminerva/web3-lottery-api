import { Controller, Post, Body, HttpException, HttpStatus, Delete, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LotteryService } from './lottery.service';

import { SetupDto } from './dto/setup.dto';
import { AddDrawDto } from './dto/add-draw.dto';
import { OpenDrawDto } from './dto/open-draw.dto';
import { ProcessDrawDto } from './dto/process-draw.dto';
import { OverrideDrawDto } from './dto/override-draw.dto';
import { CloseDrawDto } from './dto/close-draw.dto';
import { AddBetDto } from './dto/add-bet.dto';
import { GetBetsDto } from './dto/get-bets.dto';

@ApiTags('Lottery')
@Controller('api/lottery')
export class LotteryController {
  constructor(
    private readonly lotteryService: LotteryService
  ) { }

  @Post("setup")
  async setup(@Body() setupDto: SetupDto) {
    try {
      const api = await this.lotteryService.connect();
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
      const api = await this.lotteryService.connect();
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
      const api = await this.lotteryService.connect();
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

  @Post("add-draw")
  async addDraw(@Body() addDrawDto: AddDrawDto) {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.addDraw(api, addDrawDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to add draw',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete("remove-draw")
  async removeDraw() {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.removeDraw(api);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove draw',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("open-draw")
  async openDraw(@Body() openDrawDto: OpenDrawDto) {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.openDraw(api, openDrawDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to open draw',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("process-draw")
  async processDraw(@Body() processDrawDto: ProcessDrawDto) {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.processDraw(api, processDrawDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to process draw',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("override-draw")
  async overrideDraw(@Body() overrideDrawDto: OverrideDrawDto) {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.overrideDraw(api, overrideDrawDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to override draw',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("close-draw")
  async closeDraw(@Body() closeDrawDto: CloseDrawDto) {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.closeDraw(api, closeDrawDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to close draw',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("add-bet")
  async addBet(@Body() addBetDto: AddBetDto) {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.addBet(api, addBetDto);
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

  @Get("get-lottery-setup")
  async getLotterySetup() {
    try {
      const api = await this.lotteryService.connect();
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

  @Post("get-bets")
  async getBets(@Body() getBetsDto: GetBetsDto) {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.getBets(api, getBetsDto);
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

  @Get("get-draws")
  async getDraws() {
    try {
      const api = await this.lotteryService.connect();
      return this.lotteryService.getDraws(api);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to get draws',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
