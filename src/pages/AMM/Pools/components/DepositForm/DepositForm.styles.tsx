import styled from 'styled-components';

import { Dl, DlGroup, theme, TokenInput } from '@/component-library';
import { PlusDivider } from '@/components';

const StyledDl = styled(Dl)`
  background-color: ${theme.card.bg.secondary};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.rg};
`;

const StyledDlGroup = styled(DlGroup)`
  flex-direction: column;

  @media (min-width: 30em) {
    flex-direction: row;
  }
`;

const StyledPlusDivider = styled(PlusDivider)`
  margin-bottom: calc(${theme.spacing.spacing2} * -1);
  z-index: 0;
`;

const StyledTokenInput = styled(TokenInput)`
  z-index: 1;
`;

export { StyledDl, StyledDlGroup, StyledPlusDivider, StyledTokenInput };
