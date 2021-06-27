
import * as React from 'react';
import { Dialog } from '@headlessui/react';
import { PropsOf } from '@headlessui/react/dist/types';
import clsx from 'clsx';

const InterlayModalTitle = (props: PropsOf<typeof Dialog.Title>): JSX.Element => (
  <Dialog.Title {...props} />
);

const InterlayModalInnerWrapper = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'inline-block',
      'p-5',
      'overflow-hidden',
      'text-left',
      'sm:align-middle',
      'transition-all',
      'transform',
      'w-full',
      'my-8',
      'bg-white',
      'rounded-lg',
      className
    )}
    {...rest} />
);

const InterlayModal = ({
  open = false,
  onClose,
  children,
  initialFocus
}: Props): JSX.Element => {
  return (
    <Dialog
      className={clsx(
        'fixed',
        'inset-0',
        'z-interlayModal',
        'overflow-y-auto'
      )}
      open={open}
      onClose={onClose}
      initialFocus={initialFocus}>
      <div
        className={clsx(
          'px-4',
          'text-center'
        )}>
        <Dialog.Overlay
          className={clsx(
            'absolute',
            'inset-0',
            'bg-black',
            'bg-opacity-30',
            'transition-opacity'
          )} />
        {/* MEMO: this element is to trick the browser into centering the modal contents. */}
        <span
          className={clsx(
            'hidden',
            'sm:inline-block',
            'sm:align-middle',
            'sm:h-screen'
          )}
          aria-hidden='true'>
          &#8203;
        </span>
        {children}
      </div>
    </Dialog>
  );
};

export {
  InterlayModalTitle,
  InterlayModalInnerWrapper
};

// TODO: should use types from @headlessui/react
export interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined;
}

export default InterlayModal;
