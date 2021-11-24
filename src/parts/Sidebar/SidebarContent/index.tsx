
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import Navigation from './Navigation';
import CloseButton from './CloseButton';
import SocialMediaContainer from './SocialMediaContainer';
import TestNetBadge from './TestnetBadge';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import InterlayLink from 'components/UI/InterlayLink';
import { INTERLAY_COMPANY_LINK } from 'config/links';
import { WrappedTokenLogoWithTextIcon } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { PAGES } from 'utils/constants/links';
import { ReactComponent as InterlayLogoIcon } from 'assets/img/interlay-logo-with-text.svg';

const DarkModeToggle = React.lazy(() =>
  import(/* webpackChunkName: 'dark-mode-toggle' */ 'containers/DarkModeToggle')
);

interface Props {
  onSmallScreen?: boolean;
  onClose: () => void;
}

type Ref = HTMLDivElement;
const SidebarContent = React.forwardRef<Ref, Props>(({
  onSmallScreen,
  onClose
}, ref): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      ref={ref}
      className={clsx(
        onSmallScreen ? clsx(
          'relative',
          'max-w-xs',
          'w-full'
        ) : clsx(
          'h-0',
          'border-r',

          // TODO: could be reused
          // MEMO: inspired by https://mui.com/components/buttons/
          'border-black',
          'border-opacity-25',
          'dark:border-white',
          'dark:border-opacity-25'
        ),
        'flex-1',
        'flex',
        'flex-col',
        { 'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
      )}>
      {onSmallScreen && <CloseButton onClick={onClose} />}
      <div
        className={clsx(
          onSmallScreen ?
            'h-0' :
            clsx(
              'flex',
              'flex-col'
            ),
          'flex-1',
          'pt-5',
          'pb-4',
          'overflow-y-auto'
        )}>
        <div
          className={clsx(
            'flex-shrink-0',
            'flex',
            'items-start',
            'px-4'
          )}>
          <InterlayRouterLink to={PAGES.HOME}>
            <WrappedTokenLogoWithTextIcon width={141.6} />
          </InterlayRouterLink>
          {process.env.REACT_APP_BITCOIN_NETWORK !== 'mainnet' && (
            <TestNetBadge className='ml-2' />
          )}
        </div>
        <Navigation
          onSmallScreen={onSmallScreen}
          className='mt-5' />
        {process.env.NODE_ENV !== 'production' && (
          <React.Suspense fallback={null}>
            <div
              className={clsx(
                'flex',
                'justify-center'
              )}>
              <DarkModeToggle />
            </div>
          </React.Suspense>
        )}
        <SocialMediaContainer className='p-2' />
      </div>
      <div
        className={clsx(
          'flex-shrink-0',
          'flex',
          'border-t',
          'p-4',

          // TODO: could be reused
          // MEMO: inspired by https://mui.com/components/buttons/
          'border-black',
          'border-opacity-25',
          'dark:border-white',
          'dark:border-opacity-25'
        )}>
        <InterlayLink
          className={clsx(
            'flex',
            'items-center',
            'justify-center',
            'space-x-2',
            'w-full'
          )}
          href={INTERLAY_COMPANY_LINK}
          target='_blank'
          rel='noopener noreferrer'>
          <span className='font-medium'>
            {t('built_by')}
          </span>
          <InterlayLogoIcon
            className={clsx(
              { 'text-interlayHaiti':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
              { 'dark:text-kintsugiAlto': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}
            width={130}
            height={29.21} />
        </InterlayLink>
      </div>
    </div>
  );
});
SidebarContent.displayName = 'SidebarContent';

export default SidebarContent;
