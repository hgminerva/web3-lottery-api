import { Injectable } from '@nestjs/common';

import { ApiPromise } from '@polkadot/api';

import { PolkadotjsService } from './../polkadotjs/polkadotjs.service';
import { AddBetDto } from './dto/add-bet.dto';

@Injectable()
export class BetsService {

  constructor(
    private readonly polkadotJsService: PolkadotjsService
  ) { }

  addBet(api: ApiPromise, addBetDto: AddBetDto): string {
    this.polkadotJsService.validateConnection(api);
    const contract = this.polkadotJsService.createContract(api);
    const gasLimit = this.polkadotJsService.createGasLimit(api);

    const contractTx = contract.tx['addBet'](
      {
        gasLimit,
        storageDepositLimit: null
      },
      addBetDto.draw_number,
      addBetDto.bet_number,
      addBetDto.bettor,
      addBetDto.upline,
      addBetDto.tx_hash,
    );

    return contractTx.toHex();
  }

  async getBets(api: ApiPromise, draw_number: number): Promise<string> {
    this.polkadotJsService.validateConnection(api);
    const contract = this.polkadotJsService.createContract(api);
    const gasLimit = this.polkadotJsService.createGasLimit(api);

    const contractQuery = await contract.query['getBets'](
      this.polkadotJsService.contractAddress,
      {
        gasLimit,
        storageDepositLimit: null
      },
      draw_number
    );

    return JSON.stringify(contractQuery.output?.toHuman());
  }
}
