import { CurrencySymbols } from '@/types/currency';

import { IconWrapper, IconWrapperProps } from './CoinIcon.style';
import { KbtcIcon, KintIcon, KsmIcon } from './icons';

interface CoinIconProps extends IconWrapperProps {
  coin: CurrencySymbols;
}

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => {
  return (
    <IconWrapper size={size}>
      {coin === CurrencySymbols.KBTC ? (
        <KbtcIcon />
      ) : coin === CurrencySymbols.KSM ? (
        <KsmIcon />
      ) : coin === CurrencySymbols.KINT ? (
        <KintIcon />
      ) : null}
    </IconWrapper>
  );
};

export { CoinIcon };

export type { CoinIconProps };
