import styled from 'styled-components';

import { ModalHeader, P, theme } from '@/component-library';

const StyledModalHeader = styled(ModalHeader)`
  display: flex;
  flex-direction: column;
  color: ${theme.alert.status.error};
`;

const StyledPriceImpact = styled(P)`
  color: ${theme.alert.status.error};
`;

export { StyledModalHeader, StyledPriceImpact };
