
import clsx from 'clsx';

import InterlayDenimContainedButton, {
  Props as InterlayDenimContainedButtonProps
} from 'components/buttons/InterlayDenimContainedButton';

const SubmitButton = ({
  className,
  ...rest
}: InterlayDenimContainedButtonProps): JSX.Element => (
  <InterlayDenimContainedButton
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
