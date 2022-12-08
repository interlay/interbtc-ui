import styled from 'styled-components';

import { Dd, Dl, theme } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';

type StyledDdProps = {
  $status: Status;
};

const StyledDd = styled(Dd)<StyledDdProps>`
  background-color: ${({ $status }) => theme.alert.bg[$status]};
  color: ${({ $status }) => theme.alert.status[$status]};
  font-weight: ${theme.fontWeight.medium};
  padding: ${theme.spacing.spacing1};
  border-radius: ${theme.rounded.md};
  display: flex;
  gap: ${theme.spacing.spacing2};
  align-items: center;
`;

const StyledDl = styled(Dl)`
  font-size: ${theme.text.s};
`;

export { StyledDd, StyledDl };
