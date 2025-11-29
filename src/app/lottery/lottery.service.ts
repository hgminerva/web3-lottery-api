import { Injectable } from '@nestjs/common';

import metadata from './../../../contract/lottery.json';

import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

import { SetupDto } from './dto/setup.dto';

@Injectable()
export class LotteryService {
  private readonly contractAddress = process.env.CONTRACT_ADDRESS || '';
  private readonly contractGasOptions = { storageDepositLimit: null, gasLimit: -1 };

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

  getLotterySetup(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['getLotterySetup'](this.contractGasOptions);

    return contractTx.toHex();
  }
}
