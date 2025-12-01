import { Injectable } from '@nestjs/common';

import metadata from './../../../contract/lottery.json';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ExtrinsicStatus, WeightV2 } from '@polkadot/types/interfaces';

@Injectable()
export class PolkadotjsService {
  contractAddress = process.env.CONTRACT_ADDRESS || '';

  async connect(): Promise<ApiPromise> {
    await cryptoWaitReady();

    const wsProvider = new WsProvider(process.env.WS_PROVIDER || '');
    const api = await ApiPromise.create({ provider: wsProvider });

    return api;
  }

  initContract(api: ApiPromise): ContractPromise {
    return new ContractPromise(api, metadata, this.contractAddress);
  }

  createGasLimit(api: ApiPromise): WeightV2 {
    return api.registry.createType<WeightV2>('WeightV2', {
      refTime: 10000000000n,
      proofSize: 1000000n
    });
  }

  validateConnection(api: ApiPromise): void {
    if (!api.isConnected) {
      throw new Error('API is not connected');
    }
  }

  sendTransaction(api: ApiPromise, signedHex: string, callback: (result: ExtrinsicStatus) => void): void {
    this.validateConnection(api);

    const extrinsic = api.createType('Extrinsic', signedHex);
    api.rpc.author.submitAndWatchExtrinsic(extrinsic, (result) => {
      callback(result);
    }).catch((error) => {
      throw new Error(`Failed to execute extrinsic: ${error.message}`);
    });
  }
}
