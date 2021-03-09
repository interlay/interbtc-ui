import React from 'react';
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
}: Props & ButtonProps) => (
  <Button
    disabled={isPending || disabled}
    {...rest}>
    {(isPending && <FaHourglass />) || children}
  </Button>
);

export default ButtonMaybePending;
