import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LotteryModule } from './app/lottery/lottery.module';
import { DrawsModule } from './app/draws/draws.module';
import { BetsModule } from './app/bets/bets.module';
import { PolkadotjsModule } from './app/polkadotjs/polkadotjs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LotteryModule,
    DrawsModule,
    BetsModule,
    PolkadotjsModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule { }
