import styled from 'styled-components';

import { Dl, theme } from '@/component-library';

const StyledDl = styled(Dl)`
  background-color: ${theme.card.secondaryBg};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.rg};
`;

export { StyledDl };
