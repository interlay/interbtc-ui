import styled from 'styled-components';

import { Dl, Flex, theme } from '@/component-library';

const StyledEarnStrategyForm = styled(Flex)`
  margin-top: ${theme.spacing.spacing8};
  background: ${theme.colors.bgPrimary};
  padding: ${theme.spacing.spacing6};
  border-radius: ${theme.rounded.md};
`;

const StyledDl = styled(Dl)`
  background-color: ${theme.card.bg.secondary};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.rg};
`;

const StyledEarnStrategyFormContent = styled(Flex)`
  flex-direction: column;
  gap: ${theme.spacing.spacing8};
`;

const StyledSwitchLabel = styled('label')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: ${theme.fontWeight.bold};
`;

export { StyledDl, StyledEarnStrategyForm, StyledEarnStrategyFormContent, StyledSwitchLabel };
