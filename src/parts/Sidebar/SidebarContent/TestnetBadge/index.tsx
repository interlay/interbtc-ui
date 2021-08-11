
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import InterlayCinnabarBadge, { Props as InterlayCinnabarBadgeProps } from 'components/badges/InterlayCinnabarBadge';
import InterlayTooltip from 'components/InterlayTooltip';

const TestNetBadge = ({
  className,
  ...rest
}: InterlayCinnabarBadgeProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <InterlayTooltip label='All testnet assets are for testing purposes only and have no real value.'>
      <InterlayCinnabarBadge
        className={clsx(
          'cursor-default',
          className
        )}
        {...rest}>
        {t('test_net')}
      </InterlayCinnabarBadge>
    </InterlayTooltip>
  );
};

export default TestNetBadge;
