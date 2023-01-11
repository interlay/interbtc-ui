import { FC, forwardRef } from 'react';

import { IconProps } from '../Icon';
import { BTC, DOT, IBTC, INTR, KBTC, KINT, KSM, LKSM, USDT } from './icons';

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

type CoinIconProps = Props & NativeAttrs;

const CoinIcon = forwardRef<SVGSVGElement, CoinIconProps>(
  ({ ticker, ...props }, ref): JSX.Element => {
    const CoinIcon = (coinsIcon[ticker] || (() => null)) as any;

    return <CoinIcon ref={ref} {...props} />;
  }
);

CoinIcon.displayName = 'CoinIcon';

export { CoinIcon };
export type { CoinIconProps };
