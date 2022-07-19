import styled from 'styled-components';

import { theme } from '../theme';

const CoinPairWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.spacing2};
  align-items: center;
  font-weight: ${theme.fontWeight.medium};
  white-space: nowrap;
`;

interface NumericValueProps {
  highlight?: boolean;
}

const NumericValue = styled.div<NumericValueProps>`
  color: ${(props) => (props.highlight ? theme.colors.textSecondary : 'inherit')};
  font-weight: ${theme.fontWeight.medium};
`;

export { CoinPairWrapper, NumericValue };
