import { forwardRef, useCallback } from 'react';

import { Icon } from '../Icon';
import { CoinIconProps } from './CoinIcon';
import { FallbackIcon } from './FallbackIcon';
import { coins } from './utils';

type Props = {
  tickers: string[];
};

type InheritAttrs = Omit<CoinIconProps, keyof Props>;

type LPCoinIconProps = Props & InheritAttrs;

const LPCoinIcon = forwardRef<SVGSVGElement, LPCoinIconProps>(
  ({ tickers, size = 'md', ticker, ...props }, ref): JSX.Element => {
    const [tickerA, tickerB, tickerC, tickerD] = tickers;

    const getIcon = useCallback(
      (ticker: string) => coins[ticker] || (() => <FallbackIcon size={size} ticker={ticker} />),
      [size]
    );

    const IconA = getIcon(tickerA);
    const IconB = getIcon(tickerB);

    if (tickers.length === 2) {
      return (
        <Icon size={size} ref={ref} {...props}>
          <title>{ticker}</title>
          <IconA size={size} width='70%' height='70%' y='15%' />
          <IconB size={size} width='70%' height='70%' y='15%' x='30%' />
        </Icon>
      );
    }

    const IconC = getIcon(tickerC);

    const hasIconD = !!tickerD;

    const IconD = hasIconD && getIcon(tickerD);

    const commonSize = {
      width: '60%',
      height: '60%'
    };

    return (
      <Icon size={size} ref={ref}>
        <title>{ticker}</title>
        <IconA size={size} {...commonSize} />
        <IconB size={size} x='40%' {...commonSize} />
        <IconC size={size} y='40%' x={hasIconD ? '0' : '20%'} {...commonSize} />
        {IconD && <IconD size={size} x='40%' y='40%' {...commonSize} />}
      </Icon>
    );
  }
);

LPCoinIcon.displayName = 'LPCoinIcon';

export { LPCoinIcon };
export type { LPCoinIconProps };
