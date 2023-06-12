import styled from 'styled-components';

import { Dl, DlGroup, theme } from '@/component-library';

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

export { StyledDl, StyledDlGroup };
