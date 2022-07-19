import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as InterlayLogoWithTextIcon } from '@/assets/img/interlay-logo-with-text.svg';
import InterlayLink from '@/components/UI/InterlayLink';
import InterlayRouterLink from '@/components/UI/InterlayRouterLink';
import { INTERLAY_COMPANY_LINK } from '@/config/links';
import { GovernanceTokenLogoWithTextIcon } from '@/config/relay-chains';
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
          { 'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
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
        <div className={clsx('flex-shrink-0', 'flex', 'p-4', BORDER_CLASSES, 'border-t')}>
          <InterlayLink
            className={clsx('flex', 'items-center', 'justify-center', 'space-x-2', 'w-full')}
            href={INTERLAY_COMPANY_LINK}
            target='_blank'
            rel='noopener noreferrer'
          >
            <span className='font-medium'>{t('built_by')}</span>
            <InterlayLogoWithTextIcon
              className={clsx(
                { 'text-interlayHaiti': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiAlto': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
              width={130}
              height={29.21}
            />
          </InterlayLink>
        </div>
        <p className={clsx('px-4', 'pb-4', 'text-center')}>
          {t('version')} {process.env.REACT_APP_VERSION}
        </p>
      </div>
    );
  }
);

SidebarContent.displayName = 'SidebarContent';

export default SidebarContent;
