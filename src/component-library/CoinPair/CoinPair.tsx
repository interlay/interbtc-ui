import { Tokens } from '../types';
import { CoinIcon } from '..';
import { CoinPairWrapper, CoinPairWrapperProps } from './CoinPair.style';

interface CoinPairProps extends CoinPairWrapperProps {
  coinOne: Tokens;
  coinTwo: Tokens;
}

const CoinPair = ({ coinOne, coinTwo, size }: CoinPairProps): JSX.Element => (
  <CoinPairWrapper size={size}>
    <CoinIcon size={size} coin={coinOne} />
    <CoinIcon size={size} coin={coinTwo} />
  </CoinPairWrapper>
);

export { CoinPair };

export type { CoinPairProps };
