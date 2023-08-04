import styled from 'styled-components';

import { theme } from '@/component-library';

const StyledList = styled.div`
  display: grid;
  grid-auto-flow: row dense;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${theme.spacing.spacing4};

  @media ${theme.breakpoints.up('sm')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media ${theme.breakpoints.up('lg')} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media ${theme.breakpoints.up('xl')} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export { StyledList };
