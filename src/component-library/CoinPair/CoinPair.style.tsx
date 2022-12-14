import styled from 'styled-components';

import { Sizes } from '../utils/prop-types';

interface CoinPairWrapperProps {
  $size: Sizes;
}

const CoinPairWrapper = styled.div<CoinPairWrapperProps>`
  display: flex;

  & :first-child {
    margin-right: ${(props) => {
      switch (props.$size) {
        case 'small':
          return '-5px';
        case 'medium':
          return '-10px';
        case 'large':
          return '-15px';
      }
    }};
    z-index: 1;
  }
`;

export { CoinPairWrapper };

export type { CoinPairWrapperProps };
