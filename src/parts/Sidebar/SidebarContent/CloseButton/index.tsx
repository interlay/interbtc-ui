
import * as React from 'react';
import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';

type Ref = HTMLButtonElement;
const CloseButton = React.forwardRef<Ref, InterlayButtonBaseProps>(({
  onClick
}, ref): JSX.Element => {
  return (
    <Transition.Child
      as={React.Fragment}
      enter={clsx(
        'ease-in-out',
        'duration-300'
      )}
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave={clsx(
        'ease-in-out',
        'duration-300'
      )}
      leaveFrom='opacity-100'
      leaveTo='opacity-0'>
      <div
        className={clsx(
          'absolute',
          'top-0',
          'right-0',
          '-mr-12',
          'pt-2'
        )}>
        <InterlayButtonBase
          ref={ref}
          className={clsx(
            'ml-1',
            'justify-center',
            'h-10',
            'w-10',
            'rounded-full',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-inset',
            'focus:ring-white'
          )}
          onClick={onClick}>
          <span className='sr-only'>Close sidebar</span>
          <XIcon
            className={clsx(
              'h-6',
              'w-6',
              'text-white'
            )}
            aria-hidden='true' />
        </InterlayButtonBase>
      </div>
    </Transition.Child>
  );
});
CloseButton.displayName = 'CloseButton';

export default CloseButton;
