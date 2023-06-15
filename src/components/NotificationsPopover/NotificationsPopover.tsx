import { useTranslation } from 'react-i18next';

import { ListBullet } from '@/assets/icons';
import { Notification } from '@/common/types/util.types';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  TextLink
} from '@/component-library';
import { EXTERNAL_PAGES, EXTERNAL_URL_PARAMETERS } from '@/utils/constants/links';

import { NotificationsList } from './NotificationsList';
import { StyledCTA } from './NotificationsPopover.styles';

type NotificationsPopoverProps = {
  address?: string;
  items: Notification[];
};

const NotificationsPopover = ({ address, items }: NotificationsPopoverProps): JSX.Element => {
  const { t } = useTranslation();

  const accountTransactionsUrl =
    address && EXTERNAL_PAGES.SUBSCAN.ACCOUNT.replace(`:${EXTERNAL_URL_PARAMETERS.SUBSCAN.ACCOUNT.ADDRESS}`, address);

  return (
    <Popover>
      <PopoverTrigger>
        <StyledCTA variant='outlined'>
          <ListBullet color='primary' />
        </StyledCTA>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>{t('transaction.recent_transactions')}</PopoverHeader>
        <PopoverBody>
          <NotificationsList items={items} />
        </PopoverBody>
        {accountTransactionsUrl && (
          <PopoverFooter>
            <TextLink color='secondary' size='s' external icon to={accountTransactionsUrl}>
              View all transactions
            </TextLink>
          </PopoverFooter>
        )}
      </PopoverContent>
    </Popover>
  );
};

export { NotificationsPopover };
export type { NotificationsPopoverProps };
