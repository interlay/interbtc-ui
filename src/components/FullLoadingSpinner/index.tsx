
import clsx from 'clsx';

import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

const FullLoadingSpinner = (): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'justify-center',
      'items-center',
      'absolute',
      'top-0',
      'left-0',
      'w-full',
      'h-full'
    )}>
    <SpinIcon
      className={clsx(
        'text-interlayDenim',
        'animate-spin',
        'w-9',
        'h-9'
      )} />
  </div>
);

export default FullLoadingSpinner;
