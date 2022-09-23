import { CoinIcon } from '../CoinIcon';
import { Tokens } from '../types';
import { SimpleSizes } from '../utils/prop-types';
import { CoinPairWrapper } from './CoinPair.style';

type CoinPairProps = {
  size: SimpleSizes;
  coinOne: Tokens;
  coinTwo: Tokens;
};

const CoinPair = ({ coinOne, coinTwo, size }: CoinPairProps): JSX.Element => (
  <CoinPairWrapper $size={size}>
    <CoinIcon size={size} coin={coinOne} />
    <CoinIcon size={size} coin={coinTwo} />
  </CoinPairWrapper>
);

export { CoinPair };
export type { CoinPairProps };
