/* eslint-disable no-restricted-globals */

import { createInterBtcApi, LiquidityPool, newMonetaryAmount } from '@interlay/interbtc-api';

import * as constants from '@/constants';
import { SwapPair } from '@/types/swap';

self.onmessage = async (e: MessageEvent<string>) => {
  const a = await createInterBtcApi(constants.PARACHAIN_URL, constants.BITCOIN_NETWORK);
  const { inputAmount, liquidityPools, pair } = JSON.parse(e.data) as {
    pair: SwapPair;
    liquidityPools: LiquidityPool[];
    inputAmount: number;
  };

  const inputMonetaryAmount = newMonetaryAmount(inputAmount, pair.input as any, true);

  const trade = a.amm.getOptimalTrade(inputMonetaryAmount, pair.output as any, liquidityPools);

  self.postMessage(JSON.stringify(trade));
};

export {};
