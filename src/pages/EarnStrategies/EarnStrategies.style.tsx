import styled from 'styled-components';

import { theme } from '@/component-library';
const StyledEarnStrategiesLayout = styled.div`
  display: grid;
  gap: ${theme.spacing.spacing6};
  @media (min-width: 80em) {
    grid-template-columns: 1fr 1fr;
  }
  padding: ${theme.spacing.spacing6};
`;

export { StyledEarnStrategiesLayout };
