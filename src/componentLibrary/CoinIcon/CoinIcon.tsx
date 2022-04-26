import { BtcIcon, KsmIcon, LksmIcon } from './icons';
import { IconWrapper, IconWrapperProps } from './CoinIcon.style';
import { Coins } from '../types';

interface CoinIconProps extends IconWrapperProps {
  coin: Coins;
}

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => {
  return (
    <IconWrapper size={size}>
      {coin === 'BTC' ? (
        <BtcIcon />
      ) : coin === 'KSM' ? (
        <KsmIcon />
      ) : (
        <LksmIcon />
      )}
    </IconWrapper>
  );
};

export { CoinIcon };

export type { CoinIconProps };
