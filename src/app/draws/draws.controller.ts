import { Controller, Post, Get, Body, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DrawsService } from './draws.service';
import { PolkadotjsService } from './../polkadotjs/polkadotjs.service';

import { AddDrawDto } from './dto/add-draw.dto';
import { OpenDrawDto } from './dto/open-draw.dto';
import { ProcessDrawDto } from './dto/process-draw.dto';
import { OverrideDrawDto } from './dto/override-draw.dto';
import { CloseDrawDto } from './dto/close-draw.dto';

@ApiTags('Draws')
@Controller('api/draws')
export class DrawsController {

  constructor(
    private readonly drawsService: DrawsService,
    private readonly polkadotJsService: PolkadotjsService
  ) { }

  @Post("add-draw")
  async addDraw(@Body() addDrawDto: AddDrawDto) {
    try {
      const api = await this.polkadotJsService.connect();
      return this.drawsService.addDraw(api, addDrawDto);
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
      const api = await this.polkadotJsService.connect();
      return this.drawsService.removeDraw(api);
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
      const api = await this.polkadotJsService.connect();
      return this.drawsService.openDraw(api, openDrawDto);
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
      const api = await this.polkadotJsService.connect();
      return this.drawsService.processDraw(api, processDrawDto);
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
      const api = await this.polkadotJsService.connect();
      return this.drawsService.overrideDraw(api, overrideDrawDto);
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
      const api = await this.polkadotJsService.connect();
      return this.drawsService.closeDraw(api, closeDrawDto);
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

  @Get("get-draws")
  async getDraws() {
    try {
      const api = await this.polkadotJsService.connect();
      return this.drawsService.getDraws(api);
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
