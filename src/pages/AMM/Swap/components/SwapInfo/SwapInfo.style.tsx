import styled from 'styled-components';

import { Card, theme } from '@/component-library';

const StyledCard = styled(Card)`
  background-color: ${theme.card.secondaryBg};
  padding: ${theme.spacing.spacing2};
`;

export { StyledCard };
