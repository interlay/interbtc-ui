
import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon
} from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SidebarNavLink from './SidebarNavLink';
import { INTERLAY_DOCS } from 'config/links';
import { PAGES } from 'utils/constants/links';

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

interface CustomProps {
  onSmallScreen?: boolean;
}

const Navigation = ({
  onSmallScreen = false,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'nav'>): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav
      className={clsx(
        'px-2',
        'space-y-1',
        className
      )}
      {...rest}>
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
                  'text-gray-900'
                ) :
                clsx(
                  'text-gray-600',
                  'hover:bg-interlayHaiti-50',
                  'hover:text-gray-900'
                ),
              'group',
              'flex',
              'items-center',
              'px-2',
              'py-2',
              onSmallScreen ? 'text-base' : 'text-sm',
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
                  onSmallScreen ? 'mr-4' : 'mr-3',
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
  );
};

export default Navigation;
