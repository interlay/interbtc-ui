import styled from 'styled-components';

import { marginCSS, StyledMarginProps } from '../css/margin';
import { theme } from '../theme';
import { DividerVariants, Orientation, Sizes } from '../utils/prop-types';
import { resolveColor } from '../utils/theme';

type StyledDividerProps = {
  $color: DividerVariants;
  $orientation: Orientation;
  $size: Sizes;
} & StyledMarginProps;

const StyledDivider = styled.hr<StyledDividerProps>`
  background-color: ${({ $color }) => ($color === 'default' ? 'var(--colors-border)' : resolveColor($color))};
  height: ${({ $orientation, $size }) => ($orientation === 'horizontal' ? theme.divider.size[$size] : 'auto')};
  width: ${({ $orientation, $size }) => ($orientation === 'horizontal' ? '' : theme.divider.size[$size])};
  border: 0;
  margin: 0;
  align-self: stretch;
  flex-shrink: 0;
  ${(props) => marginCSS(props)};
`;

export { StyledDivider };
