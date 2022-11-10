import styled from 'styled-components';

import { Flex } from '@/component-library';

const StyledTablesWrapper = styled(Flex)`
  flex-direction: column;

  @media (min-width: 80em) {
    flex-direction: row;
  }
`;

export { StyledTablesWrapper };
