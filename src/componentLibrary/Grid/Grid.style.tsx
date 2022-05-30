import styled from 'styled-components';
import { theme } from 'componentLibrary';

export const GridContainer = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  height: 600px;
  width: 900px;

  @media screen and (min-width: ${theme.layout.breakpoints.lg}) {
    grid-template-columns: repeat(12, 1fr);
  }
`;
