
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import {
  ClipboardListIcon,
  CashIcon,
  BookOpenIcon,
  RefreshIcon,
  ChartSquareBarIcon,
  ChipIcon,
  SwitchHorizontalIcon,
  DocumentTextIcon
} from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SidebarNavLink from './SidebarNavLink';
import Hr2 from 'components/hrs/Hr2';
import { INTERLAY_DOCS_LINK } from 'config/links';
import { TERMS_AND_CONDITIONS_LINK } from 'config/relay-chains';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import {
  GOVERNANCE_TOKEN_SYMBOL,
  CROWDLOAN_DOMAIN
} from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

interface CustomProps {
  onSmallScreen?: boolean;
}

// TODO: could be reused
const textClasses = clsx(
  'group',
  'flex',
  'items-center',
  'px-2',
  'py-2',
  'rounded-md'
);

const textClassesForSelected = clsx(
  { 'text-interlayDenim-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiMidnight-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const textClassesForUnselected = clsx(
  { 'text-interlayTextPrimaryInLightMode':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const textClassesForDisabled = clsx(
  { 'text-gray-500':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-gray-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const navigationIconClasses = clsx(
  'flex-shrink-0',
  'w-6',
  'h-6'
);

const Navigation = ({
  onSmallScreen = false,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'nav'>): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation();
  const { vaultClientLoaded } = useSelector((state: StoreType) => state.general);

  const NAVIGATION_ITEMS = React.useMemo(() => {
    return [
      {
        name: 'nav_bridge',
        link: PAGES.BRIDGE,
        icon: RefreshIcon,
        disabled: true
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
        disabled: true
      },
      {
        name: 'nav_staking',
        link: PAGES.STAKING,
        icon: CashIcon,
        disabled: true
      },
      {
        name: 'nav_dashboard',
        link: PAGES.DASHBOARD,
        icon: ChartSquareBarIcon,
        disabled: true
      },
      {
        name: 'nav_vault',
        link: PAGES.VAULT,
        icon: ChipIcon,
        disabled: true,
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
        link: CROWDLOAN_DOMAIN,
        icon: CashIcon,
        external: true,
        // This will suppress the link on testnet
        hidden: process.env.REACT_APP_BITCOIN_NETWORK !== 'mainnet',
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
        rest: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }
    ];
  }, [vaultClientLoaded]);

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
        if (navigationItem.hidden) {
          return null;
        }

        if (navigationItem.separator) {
          return (
            <Hr2 key={navigationItem.name} />
          );
        }

        if (navigationItem.disabled) {
          return (
            <p
              key={navigationItem.name}
              className={clsx(
                textClasses,
                textClassesForDisabled,
                onSmallScreen ? 'text-base' : 'text-sm',
                'font-light'
              )}>
              <navigationItem.icon
                className={clsx(
                  textClassesForDisabled,
                  navigationIconClasses,
                  onSmallScreen ? 'mr-4' : 'mr-3'
                )}
                aria-hidden='true' />
              {t(navigationItem.name)}
            </p>
          );
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
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:bg-white':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                ) :
                clsx(
                  textClassesForUnselected,
                  { 'hover:bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                ),
              onSmallScreen ? 'text-base' : 'text-sm',
              textClasses,
              'font-medium'

            )}>
            <navigationItem.icon
              className={clsx(
                match?.isExact ?
                  textClassesForSelected :
                  textClassesForUnselected,
                onSmallScreen ? 'mr-4' : 'mr-3',
                navigationIconClasses
              )}
              aria-hidden='true' />
            {navigationItem.link === CROWDLOAN_DOMAIN ?
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
