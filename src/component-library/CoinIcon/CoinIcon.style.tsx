import styled from 'styled-components';

import { Sizes } from '../utils/prop-types';

interface IconWrapperProps {
  $size: Sizes;
}

const IconWrapper = styled.div<IconWrapperProps>`
  width: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '2.625rem';
      case 'medium':
        return '3.755rem';
      case 'large':
        return '5.625rem';
    }
  }};
`;

export { IconWrapper };
