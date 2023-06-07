import styled from 'styled-components';

import { Dl, theme } from '@/component-library';

const StyledDl = styled(Dl)`
  border: ${theme.border.default};
  background-color: ${theme.card.bg.tertiary};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.lg};
`;

export { StyledDl };
