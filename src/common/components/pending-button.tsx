
import { Button, ButtonProps } from 'react-bootstrap';
import { FaHourglass } from 'react-icons/fa';

interface Props {
  isPending?: boolean;
}

const ButtonMaybePending = ({
  isPending,
  disabled,
  children,
  ...rest
}: Props & ButtonProps): JSX.Element => (
  <Button
    disabled={isPending || disabled}
    {...rest}>
    {(isPending && <FaHourglass className='inline-block' />) || children}
  </Button>
);

export default ButtonMaybePending;
