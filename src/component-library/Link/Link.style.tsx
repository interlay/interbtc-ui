import styled from 'styled-components';

import { resolveTextColor } from '../Text';
import { Colors } from '../utils/prop-types';

type StyledAnchorProps = {
  $color?: Colors;
};

const StyledAnchor = styled.a<StyledAnchorProps>`
  color: ${({ $color }) => resolveTextColor($color)};

  &:hover:not([disabled]) {
    text-decoration: underline;
  }
`;

export { StyledAnchor };
