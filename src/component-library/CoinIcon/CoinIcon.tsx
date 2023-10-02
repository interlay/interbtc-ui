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
    // TODO: The change to support wormhole assets means that some tickers include a `.wh` suffix.
    // Our code assumes tickers only include letters. The proper fix is to support tickers with a suffix,
    // so this is a temporary fix until we find time to do that work. For now the only ticker formats we
    // have are XXXX and XXXX.wh so splitting and using the first substring will work.
    const tickerSubstring = ticker.split('.')[0];

    // Only want to render multi-token if has more than 1 ticker
    if (tickers && tickers?.length > 1) {
      const tickersSubstrings = tickers.map((ticker) => ticker.split('.')[0]);
      return <LPCoinIcon ref={ref} tickers={tickersSubstrings} ticker={tickerSubstring} {...props} />;
    }

    const CoinIcon = coins[tickerSubstring];

    if (!CoinIcon) {
      return <FallbackIcon ref={ref} ticker={tickerSubstring} {...props} />;
    }

    return <CoinIcon ref={ref} {...props} />;
  }
);

CoinIcon.displayName = 'CoinIcon';

export { CoinIcon };
export type { CoinIconProps };
