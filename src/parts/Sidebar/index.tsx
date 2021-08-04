
import * as React from 'react';
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

import InterlayButtonBase from 'components/UI/InterlayButtonBase';
import { ReactComponent as InterBTCHorizontalRGBIcon } from 'assets/img/interbtc-horizontal-rgb.svg';

const navigationItems = [
  { name: 'Bridge', href: '#', icon: FolderIcon, current: false },
  { name: 'Transactions', href: '#', icon: CalendarIcon, current: false },
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Challenges', href: '#', icon: UsersIcon, current: false },
  { name: 'Feedback', href: '#', icon: InboxIcon, current: false },
  { name: 'Docs', href: '#', icon: ChartBarIcon, current: false }
];

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
                // ray test touch <<
                'bg-gray-600',
                // ray test touch >>
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
                  <img
                    className={clsx(
                      'h-8',
                      'w-auto'
                    )}
                    src='https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg'
                    alt='Workflow' />
                </div>
                <nav
                  className={clsx(
                    'mt-5',
                    'px-2',
                    'space-y-1'
                  )}>
                  {navigationItems.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        item.current ?
                          clsx(
                            // ray test touch <<
                            'bg-gray-100',
                            'text-gray-900'
                            // ray test touch >>
                          ) :
                          clsx(
                            // ray test touch <<
                            'text-gray-600',
                            'hover:bg-gray-50',
                            'hover:text-gray-900'
                            // ray test touch >>
                          ),
                        clsx(
                          'group',
                          'flex',
                          'items-center',
                          'px-2',
                          'py-2',
                          'text-base',
                          'font-medium',
                          'rounded-md'
                        )
                      )}>
                      <item.icon
                        className={clsx(
                          item.current ?
                            // ray test touch <<
                            'text-gray-500' :
                            // ray test touch >>
                            clsx(
                              // ray test touch <<
                              'text-gray-400',
                              'group-hover:text-gray-500'
                              // ray test touch >>
                            ),
                          clsx(
                            'mr-4',
                            'flex-shrink-0',
                            'h-6',
                            'w-6'
                          )
                        )}
                        aria-hidden='true' />
                      {item.name}
                    </a>
                  ))}
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
                <a
                  href='#sidebar'
                  className={clsx(
                    'flex-shrink-0',
                    'group',
                    'block'
                  )}>
                  <div
                    className={clsx(
                      'flex',
                      'items-center'
                    )}>
                    <div>
                      <img
                        className={clsx(
                          'inline-block',
                          'h-10',
                          'w-10',
                          'rounded-full'
                        )}
                        // eslint-disable-next-line max-len
                        src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                        alt='' />
                    </div>
                    <div className='ml-3'>
                      <p
                        className={clsx(
                          'text-base',
                          'font-medium',
                          // ray test touch <<
                          'text-gray-700',
                          'group-hover:text-gray-900'
                          // ray test touch >>
                        )}>
                        Tom Cook
                      </p>
                      <p
                        className={clsx(
                          'text-sm',
                          'font-medium',
                          // ray test touch <<
                          'text-gray-500',
                          'group-hover:text-gray-700'
                          // ray test touch >>
                        )}>
                        View profile
                      </p>
                    </div>
                  </div>
                </a>
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
                {navigationItems.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      item.current ?
                        clsx(
                          // ray test touch <<
                          'bg-gray-100',
                          'text-gray-900'
                          // ray test touch >>
                        ) :
                        clsx(
                          // ray test touch <<
                          'text-gray-600',
                          'hover:bg-gray-50',
                          'hover:text-gray-900'
                          // ray test touch >>
                        ),
                      clsx(
                        'group',
                        'flex',
                        'items-center',
                        'px-2',
                        'py-2',
                        'text-sm',
                        'font-medium',
                        'rounded-md'
                      )
                    )}>
                    <item.icon
                      className={clsx(
                        item.current ?
                          // ray test touch <<
                          'text-gray-500' :
                          // ray test touch >>
                          clsx(
                            // ray test touch <<
                            'text-gray-400',
                            'group-hover:text-gray-500'
                            // ray test touch >>
                          ),
                        clsx(
                          'mr-3',
                          'flex-shrink-0',
                          'h-6',
                          'w-6'
                        )
                      )}
                      aria-hidden='true' />
                    {item.name}
                  </a>
                ))}
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
              <a
                href='#sidebar'
                className={clsx(
                  'flex-shrink-0',
                  'w-full',
                  'group',
                  'block'
                )}>
                <div
                  className={clsx(
                    'flex',
                    'items-center'
                  )}>
                  <div>
                    <img
                      className={clsx(
                        'inline-block',
                        'h-9',
                        'w-9',
                        'rounded-full'
                      )}
                      // eslint-disable-next-line max-len
                      src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                      alt='' />
                  </div>
                  <div className='ml-3'>
                    <p
                      className={clsx(
                        'text-sm',
                        'font-medium',
                        // ray test touch <<
                        'text-gray-700',
                        'group-hover:text-gray-900'
                        // ray test touch >>
                      )}>
                      Tom Cook
                    </p>
                    <p
                      className={clsx(
                        'text-xs',
                        'font-medium',
                        // ray test touch <<
                        'text-gray-500',
                        'group-hover:text-gray-700'
                        // ray test touch >>
                      )}>
                      View profile
                    </p>
                  </div>
                </div>
              </a>
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
