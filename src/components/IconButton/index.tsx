
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

type CustomProps = {
  pending?: boolean;
}

const IconButton = ({
  children,
  disabled = false,
  pending = false,
  className,
  ...rest
}: Props): JSX.Element => {
  const disabledOrPending = disabled || pending;

  return (
    <InterlayButtonBase
      className={clsx(
        'rounded-full',
        'justify-center',
        'hover:bg-black',
        'hover:bg-opacity-5',
        className
      )}
      disabled={disabledOrPending}
      {...rest}>
      {pending ? (
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-5',
            'h-5'
          )} />
      ) : children}
    </InterlayButtonBase>
  );
};

export type Props = CustomProps & InterlayButtonBaseProps;

export default IconButton;
