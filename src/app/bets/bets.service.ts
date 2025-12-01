import { Injectable } from '@nestjs/common';

import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { hexToU8a } from '@polkadot/util';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';

import { PolkadotjsService } from './../polkadotjs/polkadotjs.service';
import { ExecuteBetDto } from './dto/execute-bet.dto';

@Injectable()
export class BetsService {

  constructor(
    private readonly polkadotJsService: PolkadotjsService
  ) { }

  addBet(api: ApiPromise): string {
    this.polkadotJsService.validateConnection(api);

    const contractAddress = this.polkadotJsService.contractAddress;
    const amount = process.env.MIN_BET_AMOUNT || '0.5';
    const amountInSmallestUnit = BigInt(Math.floor(parseFloat(amount) * 1_000_000));

    const formattedAmount = api.createType(
      "Compact<u128>",
      amountInSmallestUnit
    );

    const transferExtrinsic = api.tx['assets']['transferKeepAlive'](
      1984,
      contractAddress,
      formattedAmount,
    );

    return transferExtrinsic.toHex();
  }

  async executeBet(api: ApiPromise, executeBetDto: ExecuteBetDto): Promise<string> {
    this.polkadotJsService.validateConnection(api);

    return new Promise((resolve, reject) => {
      this.polkadotJsService.sendTransaction(api, executeBetDto.signed_hex, (result) => {
        try {
          if (result.isInBlock) {
            const txHashHex = result.hash.toHex();

            const contract = this.polkadotJsService.initContract(api);
            const gasLimit = this.polkadotJsService.createGasLimit(api);
            const contractTx = contract.tx['addBet'](
              {
                gasLimit,
                storageDepositLimit: null
              },
              executeBetDto.draw_number,
              executeBetDto.bet_number,
              executeBetDto.bettor,
              executeBetDto.upline,
              txHashHex
            );
            const addBetHex = contractTx.toHex();

            (async () => {
              try {
                const operatorsMnemonicSeeds = process.env.OPERATORS_MNEMONIC_SEEDS || '';
                const keyring = new Keyring({ type: 'sr25519' });
                const pair = keyring.addFromMnemonic(operatorsMnemonicSeeds);

                const txHexToBytes = hexToU8a(addBetHex);
                const extrinsic = api.createType('Extrinsic', txHexToBytes);
                const newTx = api.tx(extrinsic)
                const signedTx = await newTx.signAsync(pair);
                const signedTxHex = signedTx.toHex();

                this.polkadotJsService.sendTransaction(api, signedTxHex, (betResult: ExtrinsicStatus) => {
                  if (betResult.isInBlock) {
                    resolve(betResult.hash.toHex());
                  }
                });
              } catch (err) {
                reject(err instanceof Error ? err : new Error(String(err)));
              }
            })();
          } else {
            // Handle other statuses if needed
          }
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  }

  async getBets(api: ApiPromise, draw_number: number): Promise<string> {
    this.polkadotJsService.validateConnection(api);
    const contract = this.polkadotJsService.initContract(api);
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
