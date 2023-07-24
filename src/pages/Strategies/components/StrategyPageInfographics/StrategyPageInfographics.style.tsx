import styled from 'styled-components';

import { Card, theme } from '@/component-library';

const StyledStrategyPageInfographics = styled(Card)`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing.spacing12};
  justify-content: center;
`;

const StyledStrategyPageInfographicsNode = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing3};
  align-items: center;
  text-align: center;
  max-width: ${theme.spacing.spacing28};
  font-size: ${theme.text.s};
  font-weight: ${theme.fontWeight.bold};
`;

export { StyledStrategyPageInfographics, StyledStrategyPageInfographicsNode };
