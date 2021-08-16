
import clsx from 'clsx';
import { MenuIcon } from '@heroicons/react/outline';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';

const OpenButton = ({
  onClick
}: InterlayButtonBaseProps): JSX.Element => (
  <InterlayButtonBase
    className={clsx(
      'focus:outline-none',
      'focus:ring',
      'focus:border-interlayDenim-300',
      'focus:ring-interlayDenim-200',
      'focus:ring-opacity-50',

      '-ml-0.5',
      '-mt-0.5',
      'h-12',
      'w-12',
      'justify-center',
      'rounded-md',
      'text-interlayHaiti-400',
      'hover:text-interlayHaiti'
    )}
    onClick={onClick}>
    <span className='sr-only'>Open sidebar</span>
    <MenuIcon
      className={clsx(
        'h-6',
        'w-6'
      )}
      aria-hidden='true' />
  </InterlayButtonBase>
);

export default OpenButton;
