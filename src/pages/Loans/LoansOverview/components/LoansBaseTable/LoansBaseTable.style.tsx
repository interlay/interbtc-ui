import styled from 'styled-components';

import { Flex, H2, Span, Status, theme } from '@/component-library';

type StyledAssetCellWrapperProps = {
  $hasPadding?: boolean;
};

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

const StyledAssetCellWrapper = styled(Flex)<StyledAssetCellWrapperProps>`
  // Needs a specific rem so that row size matches on both lending and borrow tables
  padding: ${({ $hasPadding }) => $hasPadding && `0.5625rem 0`};
`;

export { StyledAssetCellWrapper, StyledCellLabel, StyledCellSubLabel, StyledCellTickerLabel, StyledTag, StyledTitle };
