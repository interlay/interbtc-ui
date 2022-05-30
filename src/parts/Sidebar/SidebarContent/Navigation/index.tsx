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
  CurrencyDollarIcon,
  ScaleIcon
} from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SidebarNavLink from './SidebarNavLink';
import Hr2 from 'components/hrs/Hr2';
import { INTERLAY_DOCS_LINK } from 'config/links';
import {
  GOVERNANCE_TOKEN_SYMBOL,
  CROWDLOAN_LINK,
  TERMS_AND_CONDITIONS_LINK,
  EARN_LINK,
  GOVERNANCE_LINK
} from 'config/relay-chains';
import { KUSAMA, POLKADOT } from 'utils/constants/relay-chain-names';
import { PAGES, URL_PARAMETERS } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

interface CustomProps {
  onSmallScreen?: boolean;
}

// TODO: could be reused

const TEXT_CLASSES = clsx('group', 'flex', 'items-center', 'px-2', 'py-2');

const TEXT_CLASSES_FOR_SELECTED = clsx(
  { 'text-interlayDenim-700': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiMidnight-700': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);
const TEXT_CLASSES_FOR_UNSELECTED = clsx(
  { 'text-interlayTextPrimaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const TEXT_CLASSES_FOR_DISABLED = clsx(
  { 'text-gray-500': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-gray-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const NAVIGATION_ICON_CLASSES = clsx('flex-shrink-0', 'w-6', 'h-6');

const Navigation = ({
  onSmallScreen = false,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'nav'>): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation();
  const { vaultClientLoaded, address } = useSelector((state: StoreType) => state.general);

  const NAVIGATION_ITEMS = React.useMemo(
    () => [
      {
        name: 'nav_transfer',
        link: PAGES.TRANSFER,
        icon: SwitchHorizontalIcon
      },
      {
        name: 'nav_staking',
        link: PAGES.STAKING,
        icon: CashIcon
      },
      {
        name: 'nav_bridge',
        link: PAGES.BRIDGE,
        icon: RefreshIcon,
        hidden: false,
        disabled: true
      },
      {
        name: 'nav_transactions',
        link: PAGES.TRANSACTIONS,
        icon: ClipboardListIcon,
        hidden: false,
        disabled: true
      },
      {
        name: 'nav_dashboard',
        link: PAGES.DASHBOARD,
        icon: ChartSquareBarIcon,
        hidden: false,
        disabled: true
      },
      {
        name: 'nav_vaults',
        link: `${PAGES.VAULTS.replace(`:${URL_PARAMETERS.VAULT.ACCOUNT}`, address)}`,
        icon: ChipIcon,
        hidden: !vaultClientLoaded,
        disabled: true
      },
      {
        name: 'nav_earn',
        link: EARN_LINK,
        icon: CurrencyDollarIcon,
        hidden: !EARN_LINK,
        external: true,
        rest: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
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
        name: 'nav_governance',
        link: GOVERNANCE_LINK,
        icon: ScaleIcon,
        external: true,
        hidden: !GOVERNANCE_LINK,
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
      }
    ],
    [address, vaultClientLoaded]
  );

  return (
    <nav className={clsx('px-2', 'space-y-1', { 'flex-1': !onSmallScreen }, className)} {...rest}>
      {NAVIGATION_ITEMS.map((navigationItem) => {
        if (navigationItem.separator) {
          return <Hr2 key={navigationItem.name} />;
        }

        if (navigationItem.hidden) {
          return null;
        }

        if (navigationItem.disabled) {
          return (
            <p
              key={navigationItem.name}
              className={clsx(
                TEXT_CLASSES_FOR_UNSELECTED,
                onSmallScreen ? 'text-base' : 'text-sm',
                'font-light',
                TEXT_CLASSES
              )}
            >
              <navigationItem.icon
                className={clsx(TEXT_CLASSES_FOR_DISABLED, onSmallScreen ? 'mr-4' : 'mr-3', NAVIGATION_ICON_CLASSES)}
                aria-hidden='true'
              />
              {t(navigationItem.name)} ({t('nav_coming_soon')})
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
              match?.isExact
                ? clsx(
                    TEXT_CLASSES_FOR_SELECTED,
                    { 'bg-interlayHaiti-50': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                  )
                : clsx(
                    TEXT_CLASSES_FOR_UNSELECTED,
                    { 'hover:bg-interlayHaiti-50': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                    { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                  ),
              onSmallScreen ? 'text-base' : 'text-sm',
              'font-medium',
              'rounded-md',
              TEXT_CLASSES
            )}
          >
            <navigationItem.icon
              className={clsx(
                match?.isExact ? TEXT_CLASSES_FOR_SELECTED : TEXT_CLASSES_FOR_UNSELECTED,
                onSmallScreen ? 'mr-4' : 'mr-3',
                NAVIGATION_ICON_CLASSES
              )}
              aria-hidden='true'
            />
            {navigationItem.link === CROWDLOAN_LINK
              ? // TODO: not the nicest way of handling contextual navigation text, but
                // other solutions involve substantial refactoring of the navigation
                t(navigationItem.name, { governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL })
              : t(navigationItem.name)}
          </SidebarNavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;
