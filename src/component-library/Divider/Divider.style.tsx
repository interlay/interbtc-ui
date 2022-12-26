import styled from 'styled-components';

import { resolveTextColor } from '../Text';
import { Colors, Orientation } from '../utils/prop-types';

type StyledDividerProps = {
  $color: Colors;
  $orientation: Orientation;
};

const StyledDivider = styled.hr<StyledDividerProps>`
  background-color: ${({ $color }) => resolveTextColor($color)};
  height: ${({ $orientation }) => ($orientation === 'horizontal' ? '2px' : 'auto')};
  width: ${({ $orientation }) => ($orientation === 'horizontal' ? '' : '2px')};
  border: 0;
  margin: 0;
  align-self: stretch;
`;

export { StyledDivider };
