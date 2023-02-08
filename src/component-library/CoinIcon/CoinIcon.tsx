import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';

import { IconProps } from '../Icon';
import { StyledFallbackIcon } from './CoinIcon.style';
import {
  BTC,
  DOT,
  IBTC,
  INTR,
  KBTC,
  KINT,
  KSM,
  LKSM,
  LSKSM,
  MOVR,
  qKBTC,
  qKINT,
  qKSM,
  qMOVR,
  qUSDT,
  SKSM,
  USDT,
  VKSM
} from './icons';

type CoinComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

const coinsIcon: Record<string, CoinComponent> = {
  BTC,
  DOT,
  IBTC,
  INTR,
  KBTC,
  KINT,
  KSM,
  LKSM,
  USDT,
  VKSM,
  LSKSM,
  MOVR,
  SKSM,
  qUSDT,
  qKINT,
  qKBTC,
  qKSM,
  qMOVR
};

type Props = {
  ticker: string;
};

type NativeAttrs = Omit<IconProps, keyof Props>;

type CoinIconProps = Props & NativeAttrs;

const CoinIcon = forwardRef<SVGSVGElement, CoinIconProps>(
  ({ ticker, ...props }, ref): JSX.Element => {
    const CoinIcon = coinsIcon[ticker];

    if (!CoinIcon) {
      return (
        <StyledFallbackIcon {...props} ref={ref} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <title>{ticker}</title>
          <circle cx='12' cy='12' r='11.5' fill='currentColor' />
        </StyledFallbackIcon>
      );
    }

    return <CoinIcon ref={ref} {...props} />;
  }
);

CoinIcon.displayName = 'CoinIcon';

export { CoinIcon };
export type { CoinIconProps };
