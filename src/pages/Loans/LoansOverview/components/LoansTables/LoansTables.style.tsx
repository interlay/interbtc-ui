import styled from 'styled-components';

import { Stack, theme } from '@/component-library';

const StyledTablesWrapper = styled.section`
  display: flex;
  gap: ${theme.spacing.spacing6};
  flex-direction: column;

  @media (min-width: 80em) {
    flex-direction: row;
  }
`;

const StyledTableWrapper = styled(Stack)`
  flex: 1;
`;

export { StyledTablesWrapper, StyledTableWrapper };
