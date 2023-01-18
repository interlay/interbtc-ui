import styled from 'styled-components';

import { theme } from '@/component-library';

const StyledCard = styled.div`
  background-color: ${theme.card.secondaryBg};
  padding: ${theme.spacing.spacing2};
  border-radius: ${theme.rounded.md};
`;

export { StyledCard };
