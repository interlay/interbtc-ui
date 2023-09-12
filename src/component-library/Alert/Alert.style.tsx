import styled from 'styled-components';

import { ReactComponent as WarningIcon } from '@/assets/img/icons/exclamation-triangle.svg';

import { Flex } from '../Flex';
import { theme } from '../theme';
import { Status } from '../utils/prop-types';

interface StyledAlertProps {
  $status: Status;
}

const StyledAlert = styled(Flex)<StyledAlertProps>`
  padding: ${theme.spacing.spacing2};
  border: 1px solid ${({ $status }) => theme.alert.status[$status]};
  background-color: ${({ $status }) => theme.alert.bg[$status]};
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.xs};
`;

const StyledWarningIcon = styled(WarningIcon)<StyledAlertProps>`
  color: ${({ $status }) => theme.alert.status[$status]};
  width: ${theme.spacing.spacing5};
  height: ${theme.spacing.spacing5};
  flex-shrink: 0;
`;

export { StyledAlert, StyledWarningIcon };
