import styled from 'styled-components';

import { Colors, Orientation } from '../utils/prop-types';
import { resolveColor } from '../utils/theme';

type StyledDividerProps = {
  $color: Colors;
  $orientation: Orientation;
};

const StyledDivider = styled.hr<StyledDividerProps>`
  background-color: ${({ $color }) => resolveColor($color)};
  height: ${({ $orientation }) => ($orientation === 'horizontal' ? '2px' : 'auto')};
  width: ${({ $orientation }) => ($orientation === 'horizontal' ? '' : '2px')};
  border: 0;
  margin: 0;
  align-self: stretch;
`;

export { StyledDivider };
