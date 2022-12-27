import { CoinIcon } from '../CoinIcon';
import { FontSize } from '../utils/prop-types';
import { CoinPairWrapper } from './CoinPair.style';

type CoinPairProps = {
  coinOne: string;
  coinTwo: string;
  size: FontSize;
};

const CoinPair = ({ coinOne, coinTwo, size }: CoinPairProps): JSX.Element => (
  <CoinPairWrapper $size={size}>
    <CoinIcon size={size} ticker={coinOne} />
    <CoinIcon size={size} ticker={coinTwo} />
  </CoinPairWrapper>
);

export { CoinPair };
export type { CoinPairProps };
