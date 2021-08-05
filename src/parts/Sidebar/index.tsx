
import * as React from 'react';
import {
  Dialog,
  Transition
} from '@headlessui/react';
import {
  MenuIcon,
  XIcon
} from '@heroicons/react/outline';
import clsx from 'clsx';

import Navigation from './Navigation';
import InterlayButtonBase from 'components/UI/InterlayButtonBase';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import InterlayLink from 'components/UI/InterlayLink';
import { INTERLAY_COMPANY } from 'config/links';
import { PAGES } from 'utils/constants/links';
import { ReactComponent as InterBTCHorizontalRGBIcon } from 'assets/img/interbtc-horizontal-rgb.svg';
import { ReactComponent as InterlayLogoIcon } from 'assets/img/interlay-logo.svg';

interface Props {
  children: React.ReactNode;
}

const Sidebar = ({
  children
}: Props): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
            'md:hidden'
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
                // 'bg-gray-600',
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
            <div
              className={clsx(
                'relative',
                'flex-1',
                'flex',
                'flex-col',
                'max-w-xs',
                'w-full',
                'bg-white'
              )}>
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
                  <button
                    className={clsx(
                      'ml-1',
                      'flex',
                      'items-center',
                      'justify-center',
                      'h-10',
                      'w-10',
                      'rounded-full',
                      'focus:outline-none',
                      'focus:ring-2',
                      'focus:ring-inset',
                      'focus:ring-white'
                    )}
                    onClick={() => setSidebarOpen(false)}>
                    <span className='sr-only'>Close sidebar</span>
                    <XIcon
                      className={clsx(
                        'h-6',
                        'w-6',
                        'text-white'
                      )}
                      aria-hidden='true' />
                  </button>
                </div>
              </Transition.Child>
              {/* TODO: should componentize */}
              <div
                className={clsx(
                  'flex-1',
                  'h-0',
                  'pt-5',
                  'pb-4',
                  'overflow-y-auto'
                )}>
                <div
                  className={clsx(
                    'flex-shrink-0',
                    'flex',
                    'items-center',
                    'px-4'
                  )}>
                  <InterlayRouterLink to={PAGES.HOME}>
                    <InterBTCHorizontalRGBIcon
                      width={141.6}
                      height={36} />
                  </InterlayRouterLink>
                </div>
                <Navigation
                  className='mt-5'
                  onSmallScreen />
              </div>
              <div
                className={clsx(
                  'flex-shrink-0',
                  'flex',
                  'border-t',
                  'border-interlayHaiti-100',
                  'p-4'
                )}>
                <InterlayLink
                  href={INTERLAY_COMPANY}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <InterlayLogoIcon
                    width={150}
                    height={33.7} />
                </InterlayLink>
              </div>
            </div>
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
          <div
            className={clsx(
              'flex',
              'flex-col',
              'h-0',
              'flex-1',
              'border-r',
              'border-interlayHaiti-100',
              'bg-white'
            )}>
            <div
              className={clsx(
                'flex-1',
                'flex',
                'flex-col',
                'pt-5',
                'pb-4',
                'overflow-y-auto'
              )}>
              <div
                className={clsx(
                  'flex-shrink-0',
                  'flex',
                  'items-center',
                  'px-4'
                )}>
                <InterlayRouterLink to={PAGES.HOME}>
                  <InterBTCHorizontalRGBIcon
                    width={141.6}
                    height={36} />
                </InterlayRouterLink>
              </div>
              <Navigation
                className={clsx(
                  'mt-5',
                  'flex-1',
                  'bg-white'
                )} />
            </div>
            <div
              className={clsx(
                'flex-shrink-0',
                'flex',
                'border-t',
                'border-interlayHaiti-100',
                'p-4'
              )}>
              <InterlayLink
                href={INTERLAY_COMPANY}
                target='_blank'
                rel='noopener noreferrer'>
                <InterlayLogoIcon
                  width={150}
                  height={33.7} />
              </InterlayLink>
            </div>
          </div>
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
            'md:hidden',
            'pl-1',
            'pt-1',
            'sm:pl-3',
            'sm:pt-3'
          )}>
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
            onClick={() => setSidebarOpen(true)}>
            <span className='sr-only'>Open sidebar</span>
            <MenuIcon
              className={clsx(
                'h-6',
                'w-6'
              )}
              aria-hidden='true' />
          </InterlayButtonBase>
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

export type {
  Props
};

export default Sidebar;
