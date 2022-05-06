
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import { useSelector } from 'react-redux';
import {
  ClipboardListIcon,
  CashIcon,
  BookOpenIcon,
  RefreshIcon,
  ChartSquareBarIcon,
  ChipIcon,
  SwitchHorizontalIcon,
  DocumentTextIcon,
  // ray test touch <
  CurrencyDollarIcon
  // ray test touch >
} from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SidebarNavLink from './SidebarNavLink';
import Hr2 from 'components/hrs/Hr2';
import { INTERLAY_DOCS_LINK } from 'config/links';
import {
  CROWDLOAN_LINK,
  GOVERNANCE_TOKEN_SYMBOL,
  TERMS_AND_CONDITIONS_LINK,
  // ray test touch <
  EARN_LINK
  // ray test touch >
} from 'config/relay-chains';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import {
  PAGES,
  URL_PARAMETERS
} from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

interface CustomProps {
  onSmallScreen?: boolean;
}

// TODO: could be reused
const TEXT_CLASSES_FOR_SELECTED = clsx(
  { 'text-interlayDenim-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiMidnight-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);
const TEXT_CLASSES_FOR_UNSELECTED = clsx(
  { 'text-interlayTextPrimaryInLightMode':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const Navigation = ({
  onSmallScreen = false,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'nav'>): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation();
  const {
    vaultClientLoaded,
    address
  } = useSelector((state: StoreType) => state.general);

  const NAVIGATION_ITEMS = React.useMemo(() => [
    {
      name: 'nav_bridge',
      link: PAGES.BRIDGE,
      icon: RefreshIcon,
      hidden: false
    },
    {
      name: 'nav_transfer',
      link: PAGES.TRANSFER,
      icon: SwitchHorizontalIcon
    },
    {
      name: 'nav_transactions',
      link: PAGES.TRANSACTIONS,
      icon: ClipboardListIcon,
      hidden: false
    },
    {
      name: 'nav_staking',
      link: PAGES.STAKING,
      icon: CashIcon
    },
    {
      name: 'nav_dashboard',
      link: PAGES.DASHBOARD,
      icon: ChartSquareBarIcon,
      hidden: false
    },
    {
      name: 'nav_vault',
      link: `${PAGES.VAULT.replace(`:${URL_PARAMETERS.VAULT_ACCOUNT_ADDRESS}`, address)}`,
      icon: ChipIcon,
      hidden: !vaultClientLoaded
    },
    {
      name: 'separator',
      link: '#',
      icon: () => null,
      separator: true
    },
    {
      name: 'nav_crowdloan',
      link: CROWDLOAN_LINK,
      icon: CashIcon,
      external: true,
      // This will suppress the link on testnet
      hidden: process.env.REACT_APP_BITCOIN_NETWORK !== 'mainnet' || !CROWDLOAN_LINK,
      rest: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
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
    },
    {
      name: 'nav_terms_and_conditions',
      link: TERMS_AND_CONDITIONS_LINK,
      icon: DocumentTextIcon,
      external: true,
      hidden: !TERMS_AND_CONDITIONS_LINK,
      rest: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    },
    // ray test touch <
    {
      name: 'nav_earn',
      link: EARN_LINK,
      icon: CurrencyDollarIcon,
      hidden: false,
      external: true,
      rest: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    }
    // ray test touch >
  ]
  , [
    address,
    vaultClientLoaded
  ]);

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

        if (navigationItem.hidden) {
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
                  TEXT_CLASSES_FOR_SELECTED,
                  { 'bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:bg-white':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                ) :
                clsx(
                  TEXT_CLASSES_FOR_UNSELECTED,
                  { 'hover:bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
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
                  TEXT_CLASSES_FOR_SELECTED :
                  TEXT_CLASSES_FOR_UNSELECTED,
                onSmallScreen ? 'mr-4' : 'mr-3',
                'flex-shrink-0',
                'w-6',
                'h-6'
              )}
              aria-hidden='true' />
            {navigationItem.link === CROWDLOAN_LINK ?
            // TODO: not the nicest way of handling contextual navigation text, but
            // other solutions involve substantial refactoring of the navigation
              t(navigationItem.name,
                { governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL }
              ) :
              t(navigationItem.name)}
          </SidebarNavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;
