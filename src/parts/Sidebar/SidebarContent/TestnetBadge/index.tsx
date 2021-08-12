
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import InterlayCinnabarBadge, { Props as InterlayCinnabarBadgeProps } from 'components/badges/InterlayCinnabarBadge';
import InterlayTooltip from 'components/UI/InterlayTooltip';

const TestNetBadge = ({
  className,
  ...rest
}: InterlayCinnabarBadgeProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <InterlayTooltip label={t('test_net_warning')}>
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
