import styled from 'styled-components';

import { theme } from '@/component-library';
import { TransactionDetails } from '@/components';

const StyledCard = styled.div`
  background-color: ${theme.card.bg.secondary};
  padding: ${theme.spacing.spacing2};
  border-radius: ${theme.rounded.md};
`;

const StyledTransactionDetails = styled(TransactionDetails)`
  padding: 0;
`;

export { StyledCard, StyledTransactionDetails };
