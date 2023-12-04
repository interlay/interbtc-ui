import { FlexProps } from '../Flex';
import { AlertStatus } from '../utils/prop-types';
import { StyledAlert, StyledInformationCircle, StyledWarningIcon } from './Alert.style';

type Props = {
  status?: AlertStatus;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type AlertProps = Props & InheritAttrs;

const Alert = ({ status = 'success', children, ...props }: AlertProps): JSX.Element => (
  <StyledAlert $status={status} role='alert' gap='spacing4' alignItems='center' {...props}>
    {status === 'info' ? <StyledInformationCircle $status={status} /> : <StyledWarningIcon $status={status} />}
    <div>{children}</div>
  </StyledAlert>
);

export { Alert };
export type { AlertProps };
