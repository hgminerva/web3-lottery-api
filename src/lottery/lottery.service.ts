import { Injectable } from '@nestjs/common';

import metadata from './../../contract/lottery.json';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ContractPromise } from '@polkadot/api-contract';

import { SetupDto } from './dto/setup.dto';
import { AddDrawDto } from './dto/add-draw.dto';
import { OpenDrawDto } from './dto/open-draw.dto';
import { ProcessDrawDto } from './dto/process-draw.dto';
import { OverrideDrawDto } from './dto/override-draw.dto';
import { CloseDrawDto } from './dto/close-draw.dto';
import { AddBetDto } from './dto/add-bet.dto';
import { GetBetsDto } from './dto/get-bets.dto';

@Injectable()
export class LotteryService {
  private readonly contractAddress = process.env.CONTRACT_ADDRESS || '';
  private readonly contractGasOptions = { storageDepositLimit: null, gasLimit: -1 };

  async connect(): Promise<ApiPromise> {
    await cryptoWaitReady();

    const wsProvider = new WsProvider(process.env.WS_PROVIDER || '');
    const api = await ApiPromise.create({ provider: wsProvider });

    return api;
  }

  setup(api: ApiPromise, setupDto: SetupDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['setup'](
      this.contractGasOptions,
      setupDto.operator,
      setupDto.asset_id,
      setupDto.starting_block,
      setupDto.daily_total_blocks,
      setupDto.maximum_draws,
      setupDto.maximum_bets,
    );

    return contractTx.toHex();
  }

  start(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['start'](this.contractGasOptions);

    return contractTx.toHex();
  }

  stop(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['stop'](this.contractGasOptions);

    return contractTx.toHex();
  }

  addDraw(api: ApiPromise, addDrawDto: AddDrawDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['addDraw'](
      this.contractGasOptions,
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
    const contractTx = contract.tx['removeDraw'](this.contractGasOptions);

    return contractTx.toHex();
  }

  openDraw(api: ApiPromise, openDrawDto: OpenDrawDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['openDraw'](
      this.contractGasOptions,
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
      this.contractGasOptions,
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
      this.contractGasOptions,
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
      this.contractGasOptions,
      closeDrawDto.draw_number,
    );

    return contractTx.toHex();
  }

  addBet(api: ApiPromise, addBetDto: AddBetDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['addBet'](
      this.contractGasOptions,
      addBetDto.draw_number,
      addBetDto.bet_number,
      addBetDto.bettor,
      addBetDto.upline,
      addBetDto.tx_hash,
    );

    return contractTx.toHex();
  }

  getLotterySetup(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['getLotterySetup'](this.contractGasOptions);

    return contractTx.toHex();
  }

  getBets(api: ApiPromise, getBetsDto: GetBetsDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['getBets'](
      this.contractGasOptions,
      getBetsDto.draw_number,
    );

    return contractTx.toHex();
  }

  getDraws(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['getDraws'](this.contractGasOptions);

    return contractTx.toHex();
  }
}
