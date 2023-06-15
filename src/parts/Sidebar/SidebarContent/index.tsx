import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { GovernanceTokenLogoWithTextIcon } from '@/config/relay-chains';
import InterlayRouterLink from '@/legacy-components/UI/InterlayRouterLink';
import { BitcoinNetwork } from '@/types/bitcoin';
import { PAGES } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { BORDER_CLASSES } from '@/utils/constants/styles';

import CloseButton from './CloseButton';
import Navigation from './Navigation';
import SocialMediaContainer from './SocialMediaContainer';
import TestnetBadge from './TestnetBadge';

interface Props {
  onSmallScreen?: boolean;
  onClose: () => void;
}

type Ref = HTMLDivElement;
const SidebarContent = React.forwardRef<Ref, Props>(
  ({ onSmallScreen, onClose }, ref): JSX.Element => {
    const { t } = useTranslation();

    return (
      <div
        ref={ref}
        className={clsx(
          onSmallScreen ? clsx('relative', 'max-w-xs', 'w-full') : clsx('h-0', BORDER_CLASSES, 'border-r'),
          'flex-1',
          'flex',
          'flex-col',
          { 'bg-interlayHaiti-50': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}
      >
        {onSmallScreen && <CloseButton onClick={onClose} />}
        <div
          className={clsx(
            onSmallScreen ? 'h-0' : clsx('flex', 'flex-col'),
            'flex-1',
            'pt-5',
            'pb-4',
            'overflow-y-auto'
          )}
        >
          <div className={clsx('flex-shrink-0', 'flex', 'items-start', 'px-4')}>
            <InterlayRouterLink to={PAGES.HOME}>
              <GovernanceTokenLogoWithTextIcon width={141.6} />
            </InterlayRouterLink>
            {process.env.REACT_APP_BITCOIN_NETWORK !== BitcoinNetwork.Mainnet && <TestnetBadge className='ml-2' />}
          </div>
          <Navigation onSmallScreen={onSmallScreen} className='mt-5' />
        </div>
        <SocialMediaContainer className='p-2' />
        <p className={clsx('px-4', 'pb-4', 'text-center')}>
          {t('version')} {process.env.REACT_APP_VERSION}
        </p>
      </div>
    );
  }
);

SidebarContent.displayName = 'SidebarContent';

export default SidebarContent;
