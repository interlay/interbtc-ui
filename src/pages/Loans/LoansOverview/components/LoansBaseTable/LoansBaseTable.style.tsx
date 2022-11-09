import styled from 'styled-components';

import { H2, Span, theme } from '@/component-library';

const StyledMarketTitle = styled(H2)`
  font-size: ${theme.text.xl2};
`;

const StyledCellLabel = styled(Span)`
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.s};
  display: inline-flex;
  gap: ${theme.spacing.spacing1};
  align-items: baseline;
`;

const StyledCellTickerLabel = styled(Span)`
  font-size: ${theme.text.xs};
`;

const StyledCellSubLabel = styled(Span)`
  font-size: ${theme.text.xs};
`;

export { StyledCellLabel, StyledCellSubLabel, StyledCellTickerLabel, StyledMarketTitle };
