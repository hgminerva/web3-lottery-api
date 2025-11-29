import { Injectable } from '@nestjs/common';

import metadata from './../../../contract/lottery.json';

import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

import { AddDrawDto } from './dto/add-draw.dto';
import { OpenDrawDto } from './dto/open-draw.dto';
import { ProcessDrawDto } from './dto/process-draw.dto';
import { OverrideDrawDto } from './dto/override-draw.dto';
import { CloseDrawDto } from './dto/close-draw.dto';

@Injectable()
export class DrawsService {
  private readonly contractAddress = process.env.CONTRACT_ADDRESS || '';
  private readonly contractGasLimits = { storageDepositLimit: null, gasLimit: 3000n * 1000000n };

  addDraw(api: ApiPromise, addDrawDto: AddDrawDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['addDraw'](
      this.contractGasLimits,
      addDrawDto.opening_blocks,
      addDrawDto.processing_blocks,
      addDrawDto.closing_blocks,
      addDrawDto.bet_amount,
    );

    return contractTx.toHex();
  }

  removeDraw(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['removeDraw'](this.contractGasLimits);

    return contractTx.toHex();
  }

  openDraw(api: ApiPromise, openDrawDto: OpenDrawDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['openDraw'](
      this.contractGasLimits,
      openDrawDto.draw_number,
    );

    return contractTx.toHex();
  }

  processDraw(api: ApiPromise, processDrawDto: ProcessDrawDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['processDraw'](
      this.contractGasLimits,
      processDrawDto.draw_number,
    );

    return contractTx.toHex();
  }

  overrideDraw(api: ApiPromise, overrideDrawDto: OverrideDrawDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['overrideDraw'](
      this.contractGasLimits,
      overrideDrawDto.draw_number,
      overrideDrawDto.winning_number,
    );

    return contractTx.toHex();
  }

  closeDraw(api: ApiPromise, closeDrawDto: CloseDrawDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['closeDraw'](
      this.contractGasLimits,
      closeDrawDto.draw_number,
    );

    return contractTx.toHex();
  }

  getDraws(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['getDraws'](this.contractGasLimits);

    return contractTx.toHex();
  }
}
