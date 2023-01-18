import styled from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';
import { IconSize } from '../utils/prop-types';

const getOffset = (offset: TokenOffset) => {
  switch (offset) {
    case 'lg':
      return '-0.5';
    default:
    case 'md':
      return '-0.33';
    case 's':
      return '-0.25';
  }
};

type TokenOffset = 'none' | 's' | 'md' | 'lg';

type StyledWrapperProps = {
  $size: IconSize;
  $offset: TokenOffset;
};

const StyledWrapper = styled(Flex)<StyledWrapperProps>`
  display: flex;

  > :not(:last-child) {
    // Coin one covers 30% of coin two
    margin-right: ${({ $size, $offset }) =>
      $offset !== 'none' && `calc(${theme.icon.sizes[$size]} * ${getOffset($offset)})`};
  }
`;

export { StyledWrapper };
export type { StyledWrapperProps, TokenOffset };
