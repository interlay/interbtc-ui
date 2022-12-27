import styled from 'styled-components';

import { theme } from '../theme';
import { FontSize } from '../utils/prop-types';

interface CoinPairWrapperProps {
  $size: FontSize;
}

const CoinPairWrapper = styled.div<CoinPairWrapperProps>`
  display: flex;

  & :first-child {
    // Coin one covers 30% of coin two
    margin-right: ${({ $size }) => `calc(${theme.text[$size]} * -0.3)`};
    z-index: 1;
  }
`;

export { CoinPairWrapper };
export type { CoinPairWrapperProps };
