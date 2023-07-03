import styled from 'styled-components';

import { DlGroup, theme, TokenInput } from '@/component-library';
import { PlusDivider } from '@/components';

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

export { StyledDlGroup, StyledPlusDivider, StyledTokenInput };
