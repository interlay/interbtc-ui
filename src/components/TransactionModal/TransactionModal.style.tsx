import styled from 'styled-components';

import { CheckCircle, XCircle } from '@/assets/icons';
import { Card, theme } from '@/component-library';

const StyledXCircle = styled(XCircle)`
  width: 4rem;
  height: 4rem;
`;

const StyledCheckCircle = styled(CheckCircle)`
  width: 4rem;
  height: 4rem;
`;

const StyledCard = styled(Card)`
  border-radius: ${theme.rounded.rg};
  padding: ${theme.spacing.spacing4};
`;

export { StyledCard, StyledCheckCircle, StyledXCircle };
