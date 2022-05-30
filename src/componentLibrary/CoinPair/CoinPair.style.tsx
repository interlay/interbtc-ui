import styled from 'styled-components';

interface CoinPairWrapperProps {
  size: 'small' | 'large';
}

const CoinPairWrapper = styled.div<CoinPairWrapperProps>`
  display: flex;

  & :first-child {
    margin-right: ${(props) => (props.size === 'small' ? '-5px' : '-10px')};
    z-index: 1;
  }
}
`;

export { CoinPairWrapper };

export type { CoinPairWrapperProps };
