import styled from 'styled-components';

import { InformationCircle } from '@/assets/icons';
import { Dl, Switch, theme } from '@/component-library';

const StyledDl = styled(Dl)`
  background-color: ${theme.card.bg.secondary};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.rg};
`;

const StyledInformationCircle = styled(InformationCircle)`
  margin-left: ${theme.spacing.spacing2};
  vertical-align: text-top;
`;

const StyledSwitch = styled(Switch)`
  flex-direction: row-reverse;
  justify-content: space-between;
`;

export { StyledDl, StyledInformationCircle, StyledSwitch };
