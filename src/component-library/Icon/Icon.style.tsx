import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '@material-icons/svg/svg/close/baseline.svg';
import { ReactComponent as CheckmarkIcon } from '@material-icons/svg/svg/check/baseline.svg';
import { ReactComponent as CheckCircleIcon } from '@material-icons/svg/svg/check_circle/baseline.svg';

import { theme } from 'component-library';

const BaseCloseIcon = styled(CloseIcon)`
  fill: ${theme.colors.textPrimary};
`;

const BaseCheckmarkIcon = styled(CheckmarkIcon)`
  fill: ${theme.colors.textPrimary};
`;

// ray test touch <
const BaseCheckCircleIcon = styled(CheckCircleIcon)`
  width: ${theme.spacing.spacing28};
  height: ${theme.spacing.spacing28};
  fill: ${theme.colors.textSecondary};
`;
// ray test touch >

export { BaseCloseIcon, BaseCheckmarkIcon, BaseCheckCircleIcon };
