
import * as React from 'react';
import {
  Dialog,
  Transition
} from '@headlessui/react';
import clsx from 'clsx';

import SidebarContent from './SidebarContent';
import OpenButton from './OpenButton';
interface Props {
  children: React.ReactNode;
}

const ON_SMALL_SCREEN_CLASS_NAME = 'md:hidden';

const Sidebar = ({
  children
}: Props): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleClose = () => {
    setSidebarOpen(false);
  };
  const handleOpen = () => {
    setSidebarOpen(true);
  };

  return (
    <div
      className={clsx(
        'h-screen',
        'flex',
        'overflow-hidden',
        'bg-white'
      )}>
      <Transition.Root
        show={sidebarOpen}
        as={React.Fragment}>
        <Dialog
          as='div'
          static
          className={clsx(
            'fixed',
            'inset-0',
            'flex',
            'z-40',
            ON_SMALL_SCREEN_CLASS_NAME
          )}
          open={sidebarOpen}
          onClose={setSidebarOpen}>
          <Transition.Child
            as={React.Fragment}
            enter={clsx(
              'transition-opacity',
              'ease-linear',
              'duration-300'
            )}
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave={clsx(
              'transition-opacity',
              'ease-linear',
              'duration-300'
            )}
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <Dialog.Overlay
              className={clsx(
                'fixed',
                'inset-0',
                'bg-interlayHaiti-400',
                'bg-opacity-75'
              )} />
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enter={clsx(
              'transition',
              'ease-in-out',
              'duration-300',
              'transform'
            )}
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave={clsx(
              'transition',
              'ease-in-out',
              'duration-300',
              'transform'
            )}
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'>
            <SidebarContent
              onSmallScreen
              onClose={handleClose} />
          </Transition.Child>
          <div
            className={clsx(
              'flex-shrink-0',
              'w-14'
            )} />
        </Dialog>
      </Transition.Root>
      <div
        className={clsx(
          'hidden',
          'md:flex',
          'md:flex-shrink-0'
        )}>
        <div
          className={clsx(
            'flex',
            'flex-col',
            'w-64'
          )}>
          <SidebarContent onClose={handleClose} />
        </div>
      </div>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'w-0',
          'flex-1',
          'overflow-hidden'
        )}>
        <div
          className={clsx(
            ON_SMALL_SCREEN_CLASS_NAME,
            'pl-1',
            'pt-1',
            'sm:pl-3',
            'sm:pt-3'
          )}>
          <OpenButton onClick={handleOpen} />
        </div>
        <main
          className={clsx(
            'flex-1',
            'relative',
            'z-0',
            'overflow-y-auto',
            'focus:outline-none'
          )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
