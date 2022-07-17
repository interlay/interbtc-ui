// ray test touch <
import styled from 'styled-components';
import { ReactComponent as CheckCircleIcon } from '@material-icons/svg/svg/check_circle/baseline.svg';

import { theme } from 'component-library';

const BaseSuccessIcon = styled(CheckCircleIcon)`
  width: ${theme.spacing.spacing24};
  height: ${theme.spacing.spacing24};
  fill: ${theme.colors.textSecondary};
`;

export { BaseSuccessIcon };
// ray test touch >
