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
      ) : coin === 'DOT' ? (
        <DotIcon />
      ) : coin === 'IBTC' ? (
        <InterBtcIcon />
      ) : coin === 'KBTC' ? (
        <KbtcIcon />
      ) : coin === 'KSM' ? (
        <KsmIcon />
      ) : coin === 'KINT' ? (
        <KintIcon />
      ) : null}
    </IconWrapper>
  );
};

export { CoinIcon };

export type { CoinIconProps };
