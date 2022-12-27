import styled from 'styled-components';

import { Colors } from '../utils/prop-types';
import { resolveColor } from '../utils/theme';

type BaseTextLinkProps = {
  $color?: Colors;
};

const BaseTextLink = styled.a<BaseTextLinkProps>`
  color: ${({ $color }) => resolveColor($color)};
`;

export { BaseTextLink };
