import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '@material-icons/svg/svg/close/baseline.svg';
import { ReactComponent as CheckmarkIcon } from '@material-icons/svg/svg/check/baseline.svg';

import { theme } from 'component-library';

const BaseCloseIcon = styled(CloseIcon)`
  fill: ${theme.colors.textPrimary};
`;

const BaseCheckmarkIcon = styled(CheckmarkIcon)`
  fill: ${theme.colors.textPrimary};
`;

export { BaseCloseIcon, BaseCheckmarkIcon };
