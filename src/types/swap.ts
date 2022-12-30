import { CurrencyExt } from '@interlay/interbtc-api';

export type SwapPair = {
  input: CurrencyExt;
  output?: CurrencyExt;
};
