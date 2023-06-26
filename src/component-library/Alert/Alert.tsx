import { FlexProps } from '../Flex';
import { Status } from '../utils/prop-types';
import { StyledAlert, StyledWarningIcon } from './Alert.style';

type Props = {
  status?: Status;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type AlertProps = Props & InheritAttrs;

const Alert = ({ status = 'success', children, ...props }: AlertProps): JSX.Element => (
  <StyledAlert $status={status} role='alert' gap='spacing4' alignItems='center' {...props}>
    <StyledWarningIcon />
    <div>{children}</div>
  </StyledAlert>
);

export { Alert };
export type { AlertProps };
