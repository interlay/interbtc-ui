import { useTranslation } from 'react-i18next';

import { Notification } from '@/common/types/util.types';
import { Flex, P } from '@/component-library';

import { NotificationListItem } from './NotificationsListItem';

type NotificationsListProps = {
  items: Notification[];
};

const NotificationsList = ({ items }: NotificationsListProps): JSX.Element => {
  const { t } = useTranslation();

  if (!items.length) {
    return (
      <P size='s' color='tertiary'>
        {t('transaction.no_recent_transactions')}
      </P>
    );
  }

  const latestTransactions = items.slice(-5);

  return (
    <Flex direction='column'>
      {latestTransactions.map((item, index) => (
        <NotificationListItem {...item} key={index} />
      ))}
    </Flex>
  );
};

export { NotificationsList };
export type { NotificationsListProps };
