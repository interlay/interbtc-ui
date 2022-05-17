import { CoinIcon } from 'componentLibrary';
import { CoinPairWrapper, CoinPairWrapperProps } from './CoinPair.style';
import { CurrencyIdLiteral } from '@interlay/interbtc-api';

interface CoinPairProps extends CoinPairWrapperProps {
  coinOne: CurrencyIdLiteral;
  coinTwo: CurrencyIdLiteral;
}

const CoinPair = ({ coinOne, coinTwo, size }: CoinPairProps): JSX.Element => (
  <CoinPairWrapper size={size}>
    <CoinIcon
      size={size}
      coin={coinOne} />
    <CoinIcon
      size={size}
      coin={coinTwo} />
  </CoinPairWrapper>
);

export { CoinPair };

export type { CoinPairProps };
