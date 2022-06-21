import { CurrencySymbols } from 'types/currency';
import { BtcIcon, DotIcon, InterBtcIcon, KbtcIcon, KintIcon, KsmIcon } from './icons';
import { IconWrapper, IconWrapperProps } from './CoinIcon.style';

interface CoinIconProps extends IconWrapperProps {
  coin: CurrencySymbols;
}

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => {
  return (
    <IconWrapper size={size}>
      {coin === CurrencySymbols.BTC ? (
        <BtcIcon />
      ) : coin === CurrencySymbols.DOT ? (
        <DotIcon />
      ) : coin === CurrencySymbols.INTERBTC ? (
        <InterBtcIcon />
      ) : coin === CurrencySymbols.KBTC ? (
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
