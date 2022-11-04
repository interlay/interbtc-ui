import styled from 'styled-components';

import { ReactComponent as WarningIcon } from '@/assets/img/icons/exclamation-triangle.svg';
import { Dd, Dl, Flex, theme } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';

type StyledDdProps = {
  $status: Status;
};

const StyledDd = styled(Dd)<StyledDdProps>`
  background-color: ${({ $status }) => theme.alert.bg[$status]};
  color: ${({ $status }) => theme.alert.status[$status]};
  padding: ${theme.spacing.spacing1};
  border-radius: ${theme.rounded.md};
  display: flex;
  gap: ${theme.spacing.spacing2};
  align-items: center;
`;

const StyledDl = styled(Dl)`
  font-size: ${theme.text.s};
`;

const StyledWarningIcon = styled(WarningIcon)`
  width: ${theme.spacing.spacing5};
  height: ${theme.spacing.spacing5};
  flex: 1 0 auto;
`;

const StyledAlert = styled(Flex)`
  padding: ${theme.spacing.spacing2};
  color: ${theme.alert.status.error};
  border: 1px solid ${theme.alert.status.error};
  background-color: ${theme.alert.bg.error};
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.xs};
`;

export { StyledAlert, StyledDd, StyledDl, StyledWarningIcon };
