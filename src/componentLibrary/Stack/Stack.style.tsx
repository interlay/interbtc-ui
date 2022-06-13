import styled from 'styled-components';

import { theme } from '../';

export const StyledDiv = styled.div`
  > *:not(:last-child) {
    margin-bottom: ${theme.spacing.spacing5}};
  }
`;
