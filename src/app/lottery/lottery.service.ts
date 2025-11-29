import { Injectable } from '@nestjs/common';

import metadata from './../../../contract/lottery.json';

import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

import { SetupDto } from './dto/setup.dto';

@Injectable()
export class LotteryService {
  private readonly contractAddress = process.env.CONTRACT_ADDRESS || '';
  private readonly contractGasLimits = { storageDepositLimit: null, gasLimit: 3000n * 1000000n };

  setup(api: ApiPromise, setupDto: SetupDto): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['setup'](
      this.contractGasLimits,
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
    const contractTx = contract.tx['start'](this.contractGasLimits);

    return contractTx.toHex();
  }

  stop(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['stop'](this.contractGasLimits);

    return contractTx.toHex();
  }

  getLotterySetup(api: ApiPromise): string {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }

    const contract = new ContractPromise(api, metadata, this.contractAddress);
    const contractTx = contract.tx['getLotterySetup'](this.contractGasLimits);

    return contractTx.toHex();
  }
}
