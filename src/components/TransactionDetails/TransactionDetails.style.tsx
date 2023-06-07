import styled from 'styled-components';

import { InformationCircle } from '@/assets/icons';
import { Dl, theme } from '@/component-library';

const StyledDl = styled(Dl)`
  border: ${theme.border.default};
  background-color: ${theme.card.bg.tertiary};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.lg};
`;

const StyledInformationCircle = styled(InformationCircle)`
  margin-left: ${theme.spacing.spacing2};
  vertical-align: text-top;
`;

export { StyledDl, StyledInformationCircle };
