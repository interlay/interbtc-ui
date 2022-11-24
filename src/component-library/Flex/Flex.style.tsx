import styled from 'styled-components';

import { theme } from '../theme';
import { AlignItems, AlignSelf, Direction, JustifyContent, Spacing, Wrap } from '../utils/prop-types';

type StyledFlexProps = {
  $gap: Spacing;
  $justifyContent?: JustifyContent;
  $alignItems?: AlignItems;
  $direction?: Direction;
  $flex?: string | number;
  $wrap?: Wrap;
  $alignSelf?: AlignSelf;
};

const StyledFlex = styled.div<StyledFlexProps>`
  display: flex;
  flex-direction: ${(props) => props.$direction};
  justify-content: ${(props) => props.$justifyContent};
  align-items: ${(props) => props.$alignItems};
  // MEMO: for handling spacing0
  gap: ${(props) => (theme.spacing as Record<Spacing, string>)[props.$gap]};
  flex: ${(props) => props.$flex};
  flex-wrap: ${(props) => (typeof props.$wrap === 'boolean' ? 'wrap' : props.$wrap)};
  align-self: ${(props) => props.$alignSelf};
`;

export { StyledFlex };
