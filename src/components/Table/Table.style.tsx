import styled from 'styled-components';

import { Span, theme } from '@/component-library';

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

export { StyledCellLabel, StyledCellSubLabel, StyledCellTickerLabel };
