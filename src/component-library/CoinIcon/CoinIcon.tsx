import { Tokens } from '../types';
import { Sizes } from '../utils/prop-types';
import { IconWrapper } from './CoinIcon.style';
import { BtcIcon, DotIcon, InterBtcIcon, KbtcIcon, KintIcon, KsmIcon } from './icons';

type CoinIconProps = {
  size: Sizes;
  coin: Tokens;
};

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => (
  <IconWrapper $size={size}>
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

export { CoinIcon };
export type { CoinIconProps };
