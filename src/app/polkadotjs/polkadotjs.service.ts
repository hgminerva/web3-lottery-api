import { Injectable } from '@nestjs/common';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

@Injectable()
export class PolkadotjsService {
  async connect(): Promise<ApiPromise> {
    await cryptoWaitReady();

    const wsProvider = new WsProvider(process.env.WS_PROVIDER || '');
    const api = await ApiPromise.create({ provider: wsProvider });

    return api;
  }
}
