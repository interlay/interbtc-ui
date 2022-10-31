import styled from 'styled-components';

import { theme } from '@/component-library';

const StyledDl = styled.dl`
  display: flex;
  flex-direction: column;
  background-color: ${theme.card.secondaryBg};
  padding: ${theme.spacing.spacing4};
  gap: ${theme.spacing.spacing2};
  min-height: 7.5rem;
`;

const StyledDItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.spacing2};
`;

const StyledMeterWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.spacing4};
`;

export { StyledDItem, StyledDl, StyledMeterWrapper };
