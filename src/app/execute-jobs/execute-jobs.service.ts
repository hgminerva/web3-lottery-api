import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PolkadotjsService } from '../polkadotjs/polkadotjs.service';

@Injectable()
export class ExecuteJobsService {

  constructor(
    private readonly polkadotJsService: PolkadotjsService,
  ) { }

  private readonly logger = new Logger(ExecuteJobsService.name);
  private isRunning = false;

  CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
  OPERATORS_MNEMONIC_SEEDS = process.env.OPERATORS_MNEMONIC_SEEDS || '';

  @Cron('*/5 * * * * *')
  async handleLotteryJobs() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      this.logger.debug('Lottery job started.');
      await this.executeLotteryJobs();

      this.logger.debug('Lottery job finished.');
    } catch (error) {
      this.logger.error('Lottery job failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  private truncateMiddle(str, head = 5, tail = 5) {
    if (typeof str !== 'string') return String(str ?? '');
    if (str.length <= head + tail + 3) return str;
    return `${str.slice(0, head)}...${str.slice(-tail)}`;
  }

  private async executeLotteryJobs() {
    const api = await this.polkadotJsService.connect();
    this.polkadotJsService.validateConnection(api);

    const contract = this.polkadotJsService.initContract(api);
    const gasLimit = this.polkadotJsService.createGasLimit(api);

    await api.rpc.chain.subscribeNewHeads(async (header) => {
      const current_block = header.number.toNumber();

      const getLotterySetup = await contract.query['getLotterySetup'](
        this.CONTRACT_ADDRESS, { gasLimit, storageDepositLimit: null }
      );
      if (getLotterySetup.output) {
        const lottery = getLotterySetup.output.toJSON() as any;
        Logger.log(`Lottery ${this.truncateMiddle(this.CONTRACT_ADDRESS)} (${lottery.ok?.isStarted}): [${lottery.ok?.startingBlock}, ${lottery.ok?.nextStartingBlock}] O:${this.truncateMiddle(lottery.ok?.operator)}, D:${this.truncateMiddle(lottery.ok?.dev)}`);

        const starting_block = Number(lottery.ok?.startingBlock.toString().replace(/,/g, ''));
        const next_starting_block = Number(lottery.ok?.nextStartingBlock.toString().replace(/,/g, ''));

        const getDraws = await contract.query['getDraws'](
          this.CONTRACT_ADDRESS, { gasLimit, storageDepositLimit: null }
        );
        if (getDraws.output) {
          const draws = getDraws.output.toJSON() as any;
          draws.ok?.map(d => {
            const opening_blocks = Number(d.openingBlocks.toString().replace(/,/g, '')) + starting_block;
            const processing_blocks = Number(d.processingBlocks.toString().replace(/,/g, '')) + starting_block;
            const closing_blocks = Number(d.closingBlocks.toString().replace(/,/g, '')) + starting_block;

            if (!d.isOpen && d.status == "Close" && current_block >= opening_blocks) {
              if (current_block < closing_blocks) {
                contract.tx['openDraw']({ gasLimit, storageDepositLimit: null },
                  d.drawNumber,
                ).signAndSend(this.OPERATORS_MNEMONIC_SEEDS, (result) => {
                  Logger.log(`Open Draw #${d.drawNumber} status: ${result.status.toString()}`);
                }).catch((error) => {
                  Logger.error(`Failed to open draw #${d.drawNumber}: ${error.message}`);
                });
              }
            }

            if (d.isOpen && d.status == "Open" && current_block >= processing_blocks) {
              contract.tx['processDraw']({ gasLimit, storageDepositLimit: null },
                d.drawNumber,
              ).signAndSend(this.OPERATORS_MNEMONIC_SEEDS, (result) => {
                Logger.log(`Process Draw #${d.drawNumber} status: ${result.status.toString()}`);
              }).catch((error) => {
                Logger.error(`Failed to process draw #${d.drawNumber}: ${error.message}`);
              });
            }

            if (!d.isOpen && d.status == "Processing" && current_block >= closing_blocks) {
              contract.tx['closeDraw']({ gasLimit, storageDepositLimit: null },
                d.drawNumber,
              ).signAndSend(this.OPERATORS_MNEMONIC_SEEDS, (result) => {
                Logger.log(`Close Draw #${d.drawNumber} status: ${result.status.toString()}`);
              }).catch((error) => {
                Logger.error(`Failed to close draw #${d.drawNumber}: ${error.message}`);
              });
            }

            const jackpot = Number(d.jackpot.toString().replace(/,/g, '')) / 1000000;

            Logger.log(`[Draw: #${d.drawNumber} (${d.status}, ${d.isOpen}, O:${opening_blocks}, P:${processing_blocks}, C:${closing_blocks}): ` +
              `Pot:${jackpot}USDT Bets:${d.bets.length} Win#:${d.winningNumber} Winners:${d.winners.length}]`);
          });
        }

        if (!lottery.ok?.isStarted && current_block >= starting_block) {
          contract.tx['start']({ gasLimit, storageDepositLimit: null })
            .signAndSend(this.OPERATORS_MNEMONIC_SEEDS, (result) => {
              Logger.log(`Start Lottery status: ${result.status.toString()}`);
            }).catch((error) => {
              Logger.error(`Failed to start lottery: ${error.message}`);
            });
        }

        if (lottery.ok?.isStarted && current_block >= next_starting_block) {
          contract.tx['stop']({ gasLimit, storageDepositLimit: null })
            .signAndSend(this.OPERATORS_MNEMONIC_SEEDS, (result) => {
              Logger.log(`Stop Lottery status: ${result.status.toString()}`);
            }).catch((error) => {
              Logger.error(`Failed to stop lottery: ${error.message}`);
            });
        }
      }
    });

    // Prevent the function from exiting
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}