import { FC } from 'react';

import { Tokens } from '../types';
import { Sizes } from '../utils/prop-types';
import { IconWrapper } from './CoinIcon.style';
import { BtcIcon, DotIcon, InterBtcIcon, KbtcIcon, KintIcon, KsmIcon } from './icons';

const elementType: Record<Tokens, FC> = {
  BTC: BtcIcon,
  DOT: DotIcon,
  IBTC: InterBtcIcon,
  KBTC: KbtcIcon,
  KSM: KsmIcon,
  KINT: KintIcon,
  INTR: () => null
};

type CoinIconProps = {
  size: Sizes;
  coin: Tokens;
};

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => {
  const CoinIcon = elementType[coin];

  return (
    <IconWrapper $size={size}>
      <CoinIcon />
    </IconWrapper>
  );
};

export { CoinIcon };
export type { CoinIconProps };
