import { KbtcIcon, KsmIcon, LksmIcon } from './icons';
import { IconWrapper, IconWrapperProps } from './CoinIcon.style';
import { CurrencyIdLiteral } from '@interlay/interbtc-api';

interface CoinIconProps extends IconWrapperProps {
  coin: CurrencyIdLiteral;
}

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => {
  return (
    <IconWrapper size={size}>
      {coin === CurrencyIdLiteral.KBTC ? (
        <KbtcIcon />
      ) : coin === CurrencyIdLiteral.KSM ? (
        <KsmIcon />
      ) : (
        <LksmIcon />
      )}
    </IconWrapper>
  );
};

export { CoinIcon };

export type { CoinIconProps };
