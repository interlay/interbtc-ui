import styled from 'styled-components';

import { theme } from '../theme';
import { DividerVariants, Orientation, Sizes } from '../utils/prop-types';
import { resolveColor } from '../utils/theme';

type StyledDividerProps = {
  $color: DividerVariants;
  $orientation: Orientation;
  $size: Sizes;
};

const StyledDivider = styled.hr<StyledDividerProps>`
  background-color: ${({ $color }) => ($color === 'default' ? 'var(--colors-border)' : resolveColor($color))};
  height: ${({ $orientation, $size }) => ($orientation === 'horizontal' ? theme.divider.size[$size] : 'auto')};
  width: ${({ $orientation, $size }) => ($orientation === 'horizontal' ? '' : theme.divider.size[$size])};
  border: 0;
  margin: 0;
  align-self: stretch;
`;

export { StyledDivider };
