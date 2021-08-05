
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import {
  Dialog,
  Transition
} from '@headlessui/react';
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  UsersIcon,
  XIcon
} from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SidebarNavLink from './SidebarNavLink';
import InterlayButtonBase from 'components/UI/InterlayButtonBase';
import InterlayLink from 'components/UI/InterlayLink';
import {
  INTERLAY_COMPANY,
  INTERLAY_DOCS
} from 'config/links';
import { PAGES } from 'utils/constants/links';
import { ReactComponent as InterBTCHorizontalRGBIcon } from 'assets/img/interbtc-horizontal-rgb.svg';
import { ReactComponent as InterlayLogoIcon } from 'assets/img/interlay-logo.svg';

interface Props {
  children: React.ReactNode;
}

const NAVIGATION_ITEMS = [
  {
    name: 'nav_bridge',
    href: PAGES.HOME,
    icon: FolderIcon
  },
  {
    name: 'nav_transactions',
    href: PAGES.TRANSACTIONS,
    icon: CalendarIcon
  },
  {
    name: 'nav_dashboard',
    href: PAGES.DASHBOARD,
    icon: HomeIcon
  },
  {
    name: 'nav_challenges',
    href: PAGES.CHALLENGES,
    icon: UsersIcon
  },
  {
    name: 'nav_feedback',
    href: PAGES.FEEDBACK,
    icon: InboxIcon
  },
  {
    name: 'nav_docs',
    href: INTERLAY_DOCS,
    icon: ChartBarIcon,
    external: true,
    rest: {
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }
];

const Sidebar = ({
  children
}: Props): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const location = useLocation();

  const { t } = useTranslation();

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
                  <InterBTCHorizontalRGBIcon
                    width={141.6}
                    height={36} />
                </div>
                <nav
                  className={clsx(
                    'mt-5',
                    'px-2',
                    'space-y-1'
                  )}>
                  {NAVIGATION_ITEMS.map(navigationItem => {
                    const match = matchPath(location.pathname, {
                      path: navigationItem.href,
                      exact: true,
                      strict: false
                    });

                    return (
                      <SidebarNavLink
                        key={navigationItem.name}
                        external={!!navigationItem.external}
                        {...navigationItem.rest}
                        href={navigationItem.href}
                        className={clsx(
                          match?.isExact ?
                            clsx(
                              // TODO: could replace `gray` with `interlayHaiti`
                              'bg-interlayHaiti-100',
                              // 'bg-gray-100',
                              // 'text-interlayHaiti'
                              'text-gray-900'
                            ) :
                            clsx(
                              // 'text-interlayHaiti-400',
                              'text-gray-600',
                              'hover:bg-interlayHaiti-50',
                              // 'hover:bg-gray-50',
                              // 'hover:text-interlayHaiti'
                              'hover:text-gray-900'
                            ),
                          'group',
                          'flex',
                          'items-center',
                          'px-2',
                          'py-2',
                          'text-base',
                          'font-medium',
                          'rounded-md'
                        )}>
                        <navigationItem.icon
                          className={clsx(
                            match?.isExact ?
                              'text-gray-500' :
                              clsx(
                                'text-gray-400',
                                'group-hover:text-gray-500'
                              ),
                            clsx(
                              'mr-4',
                              'flex-shrink-0',
                              'h-6',
                              'w-6'
                            )
                          )}
                          aria-hidden='true' />
                        {t(navigationItem.name)}
                      </SidebarNavLink>
                    );
                  })}
                </nav>
              </div>
              <div
                className={clsx(
                  'flex-shrink-0',
                  'flex',
                  'border-t',
                  'border-gray-200',
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
                  'flex',
                  'items-center',
                  'flex-shrink-0',
                  'px-4'
                )}>
                <InterBTCHorizontalRGBIcon
                  width={141.6}
                  height={36} />
              </div>
              <nav
                className={clsx(
                  'mt-5',
                  'flex-1',
                  'px-2',
                  'bg-white',
                  'space-y-1'
                )}>
                {NAVIGATION_ITEMS.map(navigationItem => {
                  const match = matchPath(location.pathname, {
                    path: navigationItem.href,
                    exact: true,
                    strict: false
                  });

                  return (
                    <SidebarNavLink
                      key={navigationItem.name}
                      external={!!navigationItem.external}
                      {...navigationItem.rest}
                      href={navigationItem.href}
                      className={clsx(
                        match?.isExact ?
                          clsx(
                            'bg-interlayHaiti-100',
                            // 'bg-gray-100',
                            'text-gray-900'
                          ) :
                          clsx(
                            'text-gray-600',
                            'hover:bg-interlayHaiti-50',
                            // 'hover:bg-gray-50',
                            'hover:text-gray-900'
                          ),
                        'group',
                        'flex',
                        'items-center',
                        'px-2',
                        'py-2',
                        'text-sm',
                        'font-medium',
                        'rounded-md'
                      )}>
                      <navigationItem.icon
                        className={clsx(
                          match?.isExact ?
                            'text-gray-500' :
                            clsx(
                              'text-gray-400',
                              'group-hover:text-gray-500'
                            ),
                          'mr-3',
                          'flex-shrink-0',
                          'h-6',
                          'w-6'
                        )}
                        aria-hidden='true' />
                      {t(navigationItem.name)}
                    </SidebarNavLink>
                  );
                })}
              </nav>
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
