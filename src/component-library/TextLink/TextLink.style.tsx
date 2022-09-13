import styled from 'styled-components';

import { resolveTextColor } from '../Text';
import { Colors } from '../utils/prop-types';

type BaseTextLinkProps = {
  $color?: Colors;
};

const BaseTextLink = styled.a<BaseTextLinkProps>`
  color: ${({ $color }) => resolveTextColor($color)};

  &[aria-disabled='true'] {
    cursor: default;
    pointer-events: none;
    opacity: 50%;
  }
`;

export { BaseTextLink };
