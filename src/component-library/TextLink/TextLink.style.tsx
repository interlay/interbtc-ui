import styled from 'styled-components';

import { Colors } from '../utils/prop-types';
import { resolveColor } from '../utils/theme';

type BaseTextLinkProps = {
  $color?: Colors;
  $underlined?: boolean;
};

const BaseTextLink = styled.a<BaseTextLinkProps>`
  color: ${({ $color }) => resolveColor($color)};
  text-decoration: ${(props) => props.$underlined && 'underline'};

  &:hover,
  &:focus-visible {
    text-decoration: ${(props) => (props.$underlined ? 'underline double' : 'underline')};
  }
`;

export { BaseTextLink };
