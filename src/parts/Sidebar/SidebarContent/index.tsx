
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
import { PAGES } from 'utils/constants/links';
import { ReactComponent as InterBTCHorizontalRGBIcon } from 'assets/img/interbtc-horizontal-rgb.svg';
import { ReactComponent as InterlayLogoIcon } from 'assets/img/interlay-logo.svg';

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
          'border-interlayHaiti-100'
        ),
        'flex-1',
        'flex',
        'flex-col',
        'bg-white'
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
            <InterBTCHorizontalRGBIcon
              width={141.6}
              height={36} />
          </InterlayRouterLink>
          <TestNetBadge className='ml-2' />
        </div>
        <Navigation
          onSmallScreen={onSmallScreen}
          className='mt-5' />
        <SocialMediaContainer className='p-2' />
      </div>
      <div
        className={clsx(
          'flex-shrink-0',
          'flex',
          'border-t',
          'border-interlayHaiti-100',
          'p-4'
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
            width={130}
            height={29.21} />
        </InterlayLink>
      </div>
    </div>
  );
});
SidebarContent.displayName = 'SidebarContent';

export default SidebarContent;
