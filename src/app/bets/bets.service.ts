import { Injectable } from '@nestjs/common';

import metadata from './../../../contract/lottery.json';

import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

import { AddBetDto } from './dto/add-bet.dto';
import { GetBetsDto } from './dto/get-bets.dto';

@Injectable()
export class BetsService {
  private readonly contractAddress = process.env.CONTRACT_ADDRESS || '';
  private readonly contractGasOptions = { storageDepositLimit: null, gasLimit: -1 };

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
}
