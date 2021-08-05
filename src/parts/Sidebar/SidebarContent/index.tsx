
import * as React from 'react';
import clsx from 'clsx';

import Navigation from './Navigation';
import CloseButton from './CloseButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import InterlayLink from 'components/UI/InterlayLink';
import { INTERLAY_COMPANY } from 'config/links';
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
            'items-center',
            'px-4'
          )}>
          <InterlayRouterLink to={PAGES.HOME}>
            <InterBTCHorizontalRGBIcon
              width={141.6}
              height={36} />
          </InterlayRouterLink>
        </div>
        <Navigation
          onSmallScreen={onSmallScreen}
          className='mt-5' />
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
          href={INTERLAY_COMPANY}
          target='_blank'
          rel='noopener noreferrer'>
          <InterlayLogoIcon
            width={150}
            height={33.7} />
        </InterlayLink>
      </div>
    </div>
  );
});
SidebarContent.displayName = 'SidebarContent';

export default SidebarContent;
