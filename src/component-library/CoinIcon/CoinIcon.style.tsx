import styled from 'styled-components';

import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

interface IconWrapperProps {
  $size: Sizes;
}

const IconWrapper = styled.div<IconWrapperProps>`
  width: ${(props) => theme.coinIcon[props.$size].width};
`;

export { IconWrapper };
