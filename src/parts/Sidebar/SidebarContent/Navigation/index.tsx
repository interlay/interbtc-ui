import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BookOpenIcon,
  ChartBarSquareIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  CpuChipIcon,
  DocumentTextIcon,
  HandRaisedIcon,
  PresentationChartBarIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';

import { StoreType } from '@/common/types/util.types';
import Hr2 from '@/components/hrs/Hr2';
import { INTERLAY_DOCS_LINK } from '@/config/links';
import {
  CROWDLOAN_LINK,
  GOVERNANCE_LINK,
  GOVERNANCE_TOKEN_SYMBOL,
  TERMS_AND_CONDITIONS_LINK,
  USE_WRAPPED_CURRENCY_LINK,
  WRAPPED_TOKEN_SYMBOL
} from '@/config/relay-chains';
import { useSubstrateSecureState } from '@/lib/substrate';
import { PAGES, URL_PARAMETERS } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

import SidebarNavLink from './SidebarNavLink';

interface CustomProps {
  onSmallScreen?: boolean;
}

// TODO: could be reused
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

const Navigation = ({
  onSmallScreen = false,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'nav'>): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation();
  const { selectedAccount } = useSubstrateSecureState();
  const { vaultClientLoaded } = useSelector((state: StoreType) => state.general);

  const NAVIGATION_ITEMS = React.useMemo(
    () => [
      {
        name: 'nav_bridge',
        link: PAGES.BRIDGE,
        icon: ArrowPathIcon,
        hidden: false
      },
      {
        name: 'nav_transfer',
        link: PAGES.TRANSFER,
        icon: ArrowsRightLeftIcon
      },
      {
        name: 'nav_lending',
        link: PAGES.LOANS,
        icon: PresentationChartBarIcon,
        disabled: true
      },
      {
        name: 'nav_swap',
        link: '#',
        icon: CircleStackIcon,
        disabled: true
      },
      {
        name: 'nav_transactions',
        link: PAGES.TRANSACTIONS,
        icon: ClipboardDocumentListIcon,
        hidden: false
      },
      {
        name: 'nav_staking',
        link: PAGES.STAKING,
        icon: BanknotesIcon
      },
      {
        name: 'nav_stats',
        link: PAGES.DASHBOARD,
        icon: ChartBarSquareIcon,
        hidden: false
      },
      {
        name: 'nav_vaults',
        link: `${PAGES.VAULTS.replace(`:${URL_PARAMETERS.VAULT.ACCOUNT}`, selectedAccount?.address ?? '')}`,
        icon: CpuChipIcon,
        hidden: !vaultClientLoaded
      },
      {
        name: 'separator',
        link: '#',
        icon: () => null,
        separator: true
      },
      {
        name: 'nav_use_wrapped',
        link: USE_WRAPPED_CURRENCY_LINK,
        icon: HandRaisedIcon,
        hidden: !USE_WRAPPED_CURRENCY_LINK,
        external: true,
        rest: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      },
      {
        name: 'nav_crowdloan',
        link: CROWDLOAN_LINK,
        icon: BanknotesIcon,
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
    [selectedAccount, vaultClientLoaded]
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
                TEXT_CLASSES_FOR_DISABLED,
                'group',
                'flex',
                'items-center',
                'px-2',
                'py-2',
                onSmallScreen ? 'text-base' : 'text-sm',
                'font-light',
                'rounded-md'
              )}
            >
              <navigationItem.icon
                className={clsx(
                  TEXT_CLASSES_FOR_DISABLED,
                  onSmallScreen ? 'mr-4' : 'mr-3',
                  'flex-shrink-0',
                  'w-6',
                  'h-6'
                )}
                aria-hidden='true'
              />
              {t(navigationItem.name)} ({t('coming_soon')})
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
              'group',
              'flex',
              'items-center',
              'px-2',
              'py-2',
              onSmallScreen ? 'text-base' : 'text-sm',
              'font-medium',
              'rounded-md'
            )}
          >
            <navigationItem.icon
              className={clsx(
                match?.isExact ? TEXT_CLASSES_FOR_SELECTED : TEXT_CLASSES_FOR_UNSELECTED,
                onSmallScreen ? 'mr-4' : 'mr-3',
                'flex-shrink-0',
                'w-6',
                'h-6'
              )}
              aria-hidden='true'
            />
            {navigationItem.link === CROWDLOAN_LINK
              ? // TODO: not the nicest way of handling contextual navigation text, but
                // other solutions involve substantial refactoring of the navigation
                t(navigationItem.name, { governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL })
              : navigationItem.link === USE_WRAPPED_CURRENCY_LINK
              ? t(navigationItem.name, { wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL })
              : t(navigationItem.name)}
          </SidebarNavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;
