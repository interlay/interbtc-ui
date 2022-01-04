
import clsx from 'clsx';

import InterlayDenimOrKintsugiMidnightContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from 'components/buttons/InterlayDenimOrKintsugiMidnightContainedButton';

const SubmitButton = ({
  className,
  ...rest
}: InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => (
  <InterlayDenimOrKintsugiMidnightContainedButton
    type='submit'
    className={clsx(
      'w-full',
      'px-6',
      'py-3',
      'text-base',
      'rounded-lg',
      className
    )}
    {...rest} />
);

export default SubmitButton;
