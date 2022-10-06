import { ReactComponent as CheckmarkIcon } from '@material-icons/svg/svg/check/baseline.svg';
import { ReactComponent as CheckCircleIcon } from '@material-icons/svg/svg/check_circle/baseline.svg';
import { ReactComponent as CloseIcon } from '@material-icons/svg/svg/close/baseline.svg';
import styled from 'styled-components';

import { ReactComponent as ChevronRight } from '@/assets/img/icons/chevron-right.svg';

import { theme } from '../theme';

const BaseCloseIcon = styled(CloseIcon)`
  fill: ${theme.colors.textPrimary};
`;

const BaseCheckmarkIcon = styled(CheckmarkIcon)`
  fill: ${theme.colors.textPrimary};
`;

const BaseCheckCircleIcon = styled(CheckCircleIcon)`
  width: ${theme.spacing.spacing28};
  height: ${theme.spacing.spacing28};
  fill: ${theme.colors.textSecondary};
`;

// TODO: our icon component should not add a fixed width, height, fill etc..., all of that should be customizable
const BaseChevronRight = styled(ChevronRight)``;

export { BaseCheckCircleIcon, BaseCheckmarkIcon, BaseChevronRight, BaseCloseIcon };
