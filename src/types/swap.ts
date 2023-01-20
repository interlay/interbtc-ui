import { CurrencyExt } from '@interlay/interbtc-api';

export type SwapPair = {
  input?: CurrencyExt;
  output?: CurrencyExt;
};

export type SwapSlippage = '0.1%' | '0.5%' | '1%' | '3%';
