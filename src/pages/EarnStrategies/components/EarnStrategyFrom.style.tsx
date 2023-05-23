import styled from 'styled-components';

import { Dl, Flex, theme } from '@/component-library';

const StyledEarnStrategyForm = styled(Flex)`
  margin-top: ${theme.spacing.spacing8};
`;

const StyledDl = styled(Dl)`
  background-color: ${theme.card.bg.secondary};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.rg};
`;

const StyledEarnStrategyFormContent = styled(Flex)`
  flex-direction: column;
  gap: ${theme.spacing.spacing12};
`;

export { StyledDl, StyledEarnStrategyForm, StyledEarnStrategyFormContent };
