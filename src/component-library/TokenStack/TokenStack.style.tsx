import styled from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';
import { IconSize } from '../utils/prop-types';

type TokenOffset = 'none' | '1/2' | '1/3' | '1/4' | '1/5';

type StyledWrapperProps = {
  $size: IconSize;
  $offset: TokenOffset;
};

const StyledWrapper = styled(Flex)<StyledWrapperProps>`
  display: flex;

  > :not(:last-child) {
    // Coin one covers 30% of coin two
    margin-right: ${({ $size, $offset }) =>
      $offset !== 'none' && `calc(${theme.icon.sizes[$size]} * calc(${$offset}) * -1)`};
  }
`;

export { StyledWrapper };
export type { StyledWrapperProps, TokenOffset };
