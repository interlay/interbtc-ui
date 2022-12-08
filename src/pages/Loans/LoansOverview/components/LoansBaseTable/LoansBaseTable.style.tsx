import styled from 'styled-components';

import { H2, Span, Status, theme } from '@/component-library';

const StyledTitle = styled(H2)`
  font-size: ${theme.text.xl};
  font-weight: ${theme.fontWeight.bold};
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

type StyledChipProps = {
  $variant: Status;
};

const StyledTag = styled.div<StyledChipProps>`
  display: inline-flex;
  font-size: ${theme.text.xs};
  padding: ${theme.spacing.spacing1} ${theme.spacing.spacing2};
  border-radius: ${theme.rounded.full};
  border: ${theme.border.default};
  border-color: ${(props) => theme.transaction.status.color[props.$variant]};
  background-color: ${(props) => theme.transaction.status.bg[props.$variant]};
`;

export { StyledCellLabel, StyledCellSubLabel, StyledCellTickerLabel, StyledTag, StyledTitle };
