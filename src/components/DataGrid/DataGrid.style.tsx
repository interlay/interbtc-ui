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

const StyledCellTag = styled(Span)`
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.bgPrimary};
  background: ${theme.colors.textSecondary};
  padding: ${theme.spacing.spacing0} ${theme.spacing.spacing2};
  border-radius: ${theme.rounded.md};
`;

export { StyledCellLabel, StyledCellSubLabel, StyledCellTag, StyledCellTickerLabel };
