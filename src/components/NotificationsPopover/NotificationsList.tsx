import { Notification } from '@/common/types/util.types';
import { P } from '@/component-library';

import { NotificationListItem } from './NotificationsListItem';

type NotificationsListProps = {
  items: Notification[];
};

const NotificationsList = ({ items }: NotificationsListProps): JSX.Element => {
  if (!items.length) {
    return (
      <P size='s' color='tertiary'>
        No recent transactions
      </P>
    );
  }

  const latestTransactions = items.slice(-5);

  return (
    <>
      {latestTransactions.map((item, index) => (
        <NotificationListItem {...item} key={index} />
      ))}
    </>
  );
};

export { NotificationsList };
export type { NotificationsListProps };
