
import { useTranslation } from 'react-i18next';

import InterlayCinnabarBadge, { Props as InterlayCinnabarBadgeProps } from 'components/badges/InterlayCinnabarBadge';

const TestNetBadge = (props: InterlayCinnabarBadgeProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <InterlayCinnabarBadge {...props}>
      {t('test_net')}
    </InterlayCinnabarBadge>
  );
};

export default TestNetBadge;
