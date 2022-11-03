import styled from 'styled-components';

import { theme } from '../theme';
import { AlignItems, Direction, JustifyContent, Spacing } from '../utils/prop-types';

const getSpacing = (number?: Spacing) => {
  const spacing = `spacing${number}` as keyof typeof theme.spacing;
  return theme.spacing[spacing];
};

type StyledFlexProps = {
  $gap: Spacing;
  $justifyContent?: JustifyContent;
  $alignItems?: AlignItems;
  $direction?: Direction;
};

const StyledFlex = styled.div<StyledFlexProps>`
  display: flex;
  flex-direction: ${(props) => props.$direction};
  justify-content: ${(props) => props.$justifyContent};
  align-items: ${(props) => props.$alignItems};
  gap: ${(props) => getSpacing(props.$gap)};
`;

export { StyledFlex };
