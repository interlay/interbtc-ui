import { useButton } from '@react-aria/button';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRef } from 'react';

import { CheckCircle, XCircle } from '@/assets/icons';
import { Notification } from '@/common/types/util.types';
import { Flex, P } from '@/component-library';
import { TransactionStatus } from '@/utils/hooks/transaction/types';

import { StyledListItem } from './NotificationsPopover.styles';

type NotificationListItemProps = Notification;

const NotificationListItem = ({ date, description, status, url }: NotificationListItemProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  const ariaLabel = url ? 'navigate to transaction subscan page' : undefined;

  const handlePress = () => window.open(url, '_blank', 'noopener');

  const { buttonProps } = useButton(
    { 'aria-label': ariaLabel, isDisabled: !url, elementType: 'div', onPress: handlePress },
    ref
  );

  return (
    <StyledListItem ref={ref} {...buttonProps}>
      <Flex elementType='span' direction='column' gap='spacing1'>
        <Flex elementType='span' alignItems='center' gap='spacing2'>
          {status === TransactionStatus.SUCCESS ? <CheckCircle color='success' /> : <XCircle color='error' />}
          <P size='s'>{description}</P>
        </Flex>
        <P size='s' color='tertiary'>
          {formatDistanceToNowStrict(date)} ago
        </P>
      </Flex>
    </StyledListItem>
  );
};

export { NotificationListItem };
export type { NotificationListItemProps };
