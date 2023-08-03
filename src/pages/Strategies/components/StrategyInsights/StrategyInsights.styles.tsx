import styled from 'styled-components';

import { Dl, theme } from '@/component-library';

const StyledDl = styled(Dl)`
  flex-direction: column;

  @media ${theme.breakpoints.up('sm')} {
    flex-direction: row;
  }
`;

export { StyledDl };
