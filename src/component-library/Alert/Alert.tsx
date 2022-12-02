import { ReactNode } from 'react';

import { Status } from '../utils/prop-types';
import { StyledAlert, StyledWarningIcon } from './Alert.style';

interface AlertProps {
  status: Status;
  children: ReactNode;
}

const Alert = ({ status, children }: AlertProps): JSX.Element => (
  <StyledAlert $status={status} role='alert' gap='spacing4' alignItems='center'>
    <StyledWarningIcon />
    <div>{children}</div>
  </StyledAlert>
);

export { Alert };
export type { AlertProps };
