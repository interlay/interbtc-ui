import styled from 'styled-components';
import { theme } from 'component-library';

export const GridContainer = styled.div`
  display: grid;
  gap: ${theme.spacing.spacing5};
  grid-template-columns: repeat(4, 1fr);

  @media screen and (min-width: ${theme.layout.breakpoints.lg}) {
    grid-template-columns: repeat(12, 1fr);
  }
`;
