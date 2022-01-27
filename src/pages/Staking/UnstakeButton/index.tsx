
import clsx from 'clsx';
import { LockClosedIcon } from '@heroicons/react/solid';

import InterlayDenimOrKintsugiMidnightContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from 'components/buttons/InterlayDenimOrKintsugiMidnightContainedButton';

const UnstakeButton = ({
  className,
  ...rest
}: InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => (
  <InterlayDenimOrKintsugiMidnightContainedButton
    className={clsx(
      'w-full',
      'px-6',
      'py-3',
      'text-base',
      'rounded-md',
      className
    )}
    startIcon={
      <LockClosedIcon
        className={clsx(
          'w-6',
          'h-6'
        )} />
    }
    disabled
    {...rest}>
    Unstake Locked until Dec 2, 2023, 8:39:45
  </InterlayDenimOrKintsugiMidnightContainedButton>
);

export default UnstakeButton;
