import { forwardRef } from 'react';

import { IconProps } from '../Icon';
import { FallbackIcon } from './FallbackIcon';
import { LPCoinIcon } from './LPCoinIcon';
import { coins } from './utils';

type Props = {
  ticker: string;
  // Multi tickers icons
  tickers?: string[];
};

type NativeAttrs = Omit<IconProps, keyof Props>;

type CoinIconProps = Props & NativeAttrs;

const CoinIcon = forwardRef<SVGSVGElement, CoinIconProps>(
  ({ ticker, tickers, ...props }, ref): JSX.Element => {
    // Only want to render multi-token if has more than 1 ticker
    if (tickers && tickers?.length > 1) {
      return <LPCoinIcon ref={ref} tickers={tickers} ticker={ticker} {...props} />;
    }

    const CoinIcon = coins[ticker];

    if (!CoinIcon) {
      return <FallbackIcon ref={ref} ticker={ticker} {...props} />;
    }

    return <CoinIcon ref={ref} {...props} />;
  }
);

CoinIcon.displayName = 'CoinIcon';

export { CoinIcon };
export type { CoinIconProps };
