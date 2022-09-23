import styled from 'styled-components';

import { theme } from '../theme';
import { SimpleSizes } from '../utils/prop-types';

interface IconWrapperProps {
  $size: SimpleSizes;
}

const IconWrapper = styled.div<IconWrapperProps>`
  width: ${(props) => theme.coinIcon[props.$size].width};
`;

export { IconWrapper };
