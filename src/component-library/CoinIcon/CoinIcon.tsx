import { FC } from 'react';

import { Tokens } from '../types';
import { Sizes } from '../utils/prop-types';
import { IconWrapper } from './CoinIcon.style';
import { BtcIcon, DotIcon, InterBtcIcon, IntrIcon, KbtcIcon, KintIcon, KsmIcon, LksmIcon, USDTIcon } from './icons';

const coinsIcon: Record<Tokens, FC> = {
  BTC: BtcIcon,
  DOT: DotIcon,
  IBTC: InterBtcIcon,
  INTR: IntrIcon,
  KBTC: KbtcIcon,
  KINT: KintIcon,
  KSM: KsmIcon,
  LKSM: LksmIcon,
  USDT: USDTIcon
};

type CoinIconProps = {
  size: Sizes;
  coin: Tokens;
};

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => {
  const CoinIcon = coinsIcon[coin] || (() => null);

  return (
    <IconWrapper $size={size}>
      <CoinIcon />
    </IconWrapper>
  );
};

export { CoinIcon };
export type { CoinIconProps };
