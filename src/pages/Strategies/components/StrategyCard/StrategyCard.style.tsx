import styled from 'styled-components';

import { Flex, P, theme } from '@/component-library';

const StyledEarningCard = styled(Flex)`
  width: 100%;
  background-color: var(--color-list-secondary-bg);
  padding: ${theme.spacing.spacing3};
  border-radius: ${theme.rounded.md};
`;

const StyledEarnSection = styled(P)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export { StyledEarningCard, StyledEarnSection };
