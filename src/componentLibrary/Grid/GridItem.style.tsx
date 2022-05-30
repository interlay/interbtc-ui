import styled from 'styled-components';
import { theme } from 'componentLibrary';

import { GridItemProps } from './GridItem';

export const GridItemContainer = styled.div<GridItemProps>`
  background-color: red;

  @media (min-width: ${theme.layout.breakpoints.lg}) {
    background-color: blue;
  }
`;
