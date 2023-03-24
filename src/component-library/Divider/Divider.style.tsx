import styled from 'styled-components';

import { Colors, Orientation, Sizes } from '../utils/prop-types';
import { resolveColor } from '../utils/theme';

type StyledDividerProps = {
  $color: Colors | 'default';
  $orientation: Orientation;
  $size: Sizes;
};

const StyledDivider = styled.hr<StyledDividerProps>`
  background-color: ${({ $color }) => ($color === 'default' ? 'var(--colors-border)' : resolveColor($color))};
  height: ${({ $orientation }) => ($orientation === 'horizontal' ? '2px' : 'auto')};
  width: ${({ $orientation }) => ($orientation === 'horizontal' ? '' : '2px')};
  border: 0;
  margin: 0;
  align-self: stretch;
`;

export { StyledDivider };
