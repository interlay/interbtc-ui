import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import InterlayCinnabarBadge, {
  Props as InterlayCinnabarBadgeProps
} from '@/legacy-components/badges/InterlayCinnabarBadge';
import InterlayTooltip from '@/legacy-components/UI/InterlayTooltip';

const TestnetBadge = ({ className, ...rest }: InterlayCinnabarBadgeProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <InterlayTooltip label={t('test_net_warning')}>
      <InterlayCinnabarBadge className={clsx('cursor-default', className)} {...rest}>
        {t('test_net')}
      </InterlayCinnabarBadge>
    </InterlayTooltip>
  );
};

export default TestnetBadge;
