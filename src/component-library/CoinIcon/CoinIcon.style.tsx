import styled from 'styled-components';

import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

interface IconWrapperProps {
  $size: Sizes | 'inherit';
}

const IconWrapper = styled.span<IconWrapperProps>`
  width: ${({ $size }) => ($size === 'inherit' ? '1em' : theme.coinIcon[$size].width)};
  height: ${({ $size }) => $size === 'inherit' && '1em'};
`;

export { IconWrapper };
