
import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import { useSelector } from 'react-redux';
import {
  ClipboardListIcon,
  // CashIcon,
  BookOpenIcon,
  RefreshIcon,
  ChartSquareBarIcon,
  ChipIcon
} from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SidebarNavLink from './SidebarNavLink';
import Hr2 from 'components/hrs/Hr2';
import { INTERLAY_DOCS_LINK } from 'config/links';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

const NAVIGATION_ITEMS = [
  {
    name: 'nav_bridge',
    link: PAGES.BRIDGE,
    icon: RefreshIcon
  },
  {
    name: 'nav_transactions',
    link: PAGES.TRANSACTIONS,
    icon: ClipboardListIcon
  },
  // TODO: blocked for now
  // {
  //   name: 'nav_staking',
  //   link: PAGES.STAKING,
  //   icon: CashIcon
  // },
  {
    name: 'nav_dashboard',
    link: PAGES.DASHBOARD,
    icon: ChartSquareBarIcon
  },
  {
    name: 'nav_vault',
    link: PAGES.VAULT,
    icon: ChipIcon
  },
  {
    name: 'separator',
    link: '#',
    icon: () => null,
    separator: true
  },
  {
    name: 'nav_docs',
    link: INTERLAY_DOCS_LINK,
    icon: BookOpenIcon,
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

// TODO: could be reused
const textClassesForSelected = clsx(
  { 'text-interlayDenim-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
  { 'dark:text-kintsugiMidnight-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);
const textClassesForUnselected = clsx(
  { 'text-interlayTextPrimaryInLightMode':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const Navigation = ({
  onSmallScreen = false,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'nav'>): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation();
  const { vaultClientLoaded } = useSelector((state: StoreType) => state.general);

  return (
    <nav
      className={clsx(
        'px-2',
        'space-y-1',
        { 'flex-1': !onSmallScreen },
        className
      )}
      {...rest}>
      {NAVIGATION_ITEMS.map(navigationItem => {
        if (navigationItem.separator) {
          return (
            <Hr2 key={navigationItem.name} />
          );
        }

        // TODO: could disable the vault link rather than hiding
        if (navigationItem.link === PAGES.VAULT && !vaultClientLoaded) {
          return null;
        }

        const match = matchPath(location.pathname, {
          path: navigationItem.link,
          exact: true,
          strict: false
        });

        return (
          <SidebarNavLink
            key={navigationItem.name}
            external={!!navigationItem.external}
            {...navigationItem.rest}
            href={navigationItem.link}
            className={clsx(
              match?.isExact ?
                clsx(
                  textClassesForSelected,
                  { 'bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
                  { 'dark:bg-white':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                ) :
                clsx(
                  textClassesForUnselected,
                  { 'hover:bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
                  { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
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
                  textClassesForSelected :
                  textClassesForUnselected,
                onSmallScreen ? 'mr-4' : 'mr-3',
                'flex-shrink-0',
                'w-6',
                'h-6'
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
