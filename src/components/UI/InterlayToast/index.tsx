
// ray test touch <<
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { Toast } from 'react-hot-toast/dist/core/types';

import IconButton from 'components/buttons/IconButton';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

interface CustomProps {
  t?: Toast;
}

type Props = React.ComponentPropsWithRef<'div'> & CustomProps;

const InterlayToast = ({
  t,
  children,
  className,
  ...rest
}: Props): JSX.Element => {
  const handleClose = () => {
    if (t) {
      toast.dismiss(t.id);
    }
  };

  return (
    <div
      className={clsx(
        'text-farmersOnlyTextPrimaryInLightMode',
        'dark:text-farmersOnlyTextPrimaryInDarkMode',

        // TODO: could be reused
        'border',
        'border-black',
        'border-opacity-25',
        'dark:border-white',
        'dark:border-opacity-25',

        'bg-paperInLightMode',
        'bg-opacity-50',
        'dark:bg-paperInDarkMode',
        'dark:bg-opacity-50',
        'p-4',
        'pr-8',
        'rounded-lg',
        'flex',
        'items-center',
        'relative',
        className
      )}
      {...rest}>
      {children}
      <IconButton
        className={clsx(
          'w-8',
          'h-8',
          'absolute',
          'top-1.5',
          'right-1.5'
        )}
        onClick={handleClose}>
        <CloseIcon
          width={18}
          height={18}
          className={clsx(
            'text-farmersOnlyTextSecondaryInLightMode',
            'dark:text-farmersOnlyTextSecondaryInDarkMode'
          )} />
      </IconButton>
    </div>
  );
};

export default InterlayToast;
// ray test touch >>
