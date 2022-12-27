import { FC } from 'react';

import { BTC, DOT, IBTC, INTR, KBTC, KINT, KSM, LKSM, USDT } from './icons';
import { IconProps } from './types';

const coinsIcon: Record<string, FC> = {
  BTC,
  DOT,
  IBTC,
  INTR,
  KBTC,
  KINT,
  KSM,
  LKSM,
  USDT
};

type Props = {
  ticker: string;
};

type NativeAttrs = Omit<IconProps, keyof Props>;

type CoinProps = Props & NativeAttrs;

const Coin = ({ ticker, ...props }: CoinProps): JSX.Element => {
  const Coin = coinsIcon[ticker] || (() => null);

  return <Coin {...props} />;
};

export { Coin };
export type { CoinProps };
