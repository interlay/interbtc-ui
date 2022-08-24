import styled from 'styled-components';

import { Card } from '../Card';
import { theme } from '../theme';

const Wrapper = styled(Card)`
  padding: 0 0 ${theme.spacing.spacing8} 0;
`;

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

export { CoinPairWrapper, NumericValue, Wrapper };
