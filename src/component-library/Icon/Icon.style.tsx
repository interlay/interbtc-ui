import styled from 'styled-components';
// ray test touch <
import { ReactComponent as CloseIcon } from '@material-icons/svg/svg/close/baseline.svg';
import { ReactComponent as CheckmarkIcon } from '@material-icons/svg/svg/check/baseline.svg';
// ray test touch >

import { theme } from 'component-library';

// ray test touch <
const BaseCloseIcon = styled(CloseIcon)`
  fill: ${theme.colors.textPrimary};
`;

const BaseCheckmarkIcon = styled(CheckmarkIcon)`
  fill: ${theme.colors.textPrimary};
`;

export { BaseCloseIcon, BaseCheckmarkIcon };
// ray test touch >
