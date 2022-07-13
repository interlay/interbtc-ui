import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { Tokens } from '../types';
import { BtcIcon, DotIcon, InterBtcIcon, KbtcIcon, KintIcon, KsmIcon } from './icons';
import { IconWrapper, IconWrapperProps } from './CoinIcon.style';

interface CoinIconProps extends IconWrapperProps {
  coin: Tokens;
}

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => {
  return (
    <IconWrapper size={size}>
      {coin === 'BTC' ? (
        <BtcIcon />
      ) : coin === CurrencyIdLiteral.DOT ? (
        <DotIcon />
      ) : coin === CurrencyIdLiteral.INTERBTC ? (
        <InterBtcIcon />
      ) : coin === CurrencyIdLiteral.KBTC ? (
        <KbtcIcon />
      ) : coin === CurrencyIdLiteral.KSM ? (
        <KsmIcon />
      ) : coin === CurrencyIdLiteral.KINT ? (
        <KintIcon />
      ) : null}
    </IconWrapper>
  );
};

export { CoinIcon };

export type { CoinIconProps };
