import styled from 'styled-components';
import { ReactComponent as CheckCircleIcon } from '@material-icons/svg/svg/check_circle/baseline.svg';

import { theme } from 'component-library';

const BaseSuccessIcon = styled(CheckCircleIcon)`
  width: ${theme.spacing.spacing28};
  height: ${theme.spacing.spacing28};
  fill: ${theme.colors.textSecondary};
`;

export { BaseSuccessIcon };
