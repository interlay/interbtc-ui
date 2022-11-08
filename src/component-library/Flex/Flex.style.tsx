import styled from 'styled-components';

import { theme } from '../theme';
import { AlignItems, Direction, JustifyContent, Spacing, Wrap } from '../utils/prop-types';

const getSpacing = (number?: Spacing) => {
  const spacing = `spacing${number}` as keyof typeof theme.spacing;
  return theme.spacing[spacing];
};

type StyledFlexProps = {
  $gap: Spacing;
  $justifyContent?: JustifyContent;
  $alignItems?: AlignItems;
  $direction?: Direction;
  $flex?: string | number;
  $wrap?: Wrap;
};

const StyledFlex = styled.div<StyledFlexProps>`
  display: flex;
  flex-direction: ${(props) => props.$direction};
  justify-content: ${(props) => props.$justifyContent};
  align-items: ${(props) => props.$alignItems};
  gap: ${(props) => getSpacing(props.$gap)};
  flex: ${(props) => props.$flex};
  flex-wrap: ${(props) => (typeof props.$wrap === 'boolean' ? 'wrap' : props.$wrap)};
`;

export { StyledFlex };
