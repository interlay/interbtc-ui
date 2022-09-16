import styled from 'styled-components';

import { Card, theme } from '@/component-library';
import { hideScrollbar } from '@/component-library/css';

const Wrapper = styled(Card)`
  padding: 0 0 ${theme.spacing.spacing8} 0;
  overflow: auto;
  ${hideScrollbar()}
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
