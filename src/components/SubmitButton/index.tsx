
import clsx from 'clsx';

import InterlayDenimOrKintsugiSupernovaContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from 'components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';

const SubmitButton = ({
  className,
  ...rest
}: InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => (
  <InterlayDenimOrKintsugiSupernovaContainedButton
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
