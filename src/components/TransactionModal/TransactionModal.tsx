import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { updateTransactionModal } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import {
  CTA,
  Flex,
  H4,
  H5,
  LoadingSpinner,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  P,
  TextLink
} from '@/component-library';
import { NotificationToast, useNotifications } from '@/utils/context/Notifications';
import { TransactionStatus } from '@/utils/hooks/transaction/types';

import { StyledCard, StyledCheckCircle, StyledXCircle } from './TransactionModal.style';

const getData = (t: TFunction, variant: TransactionStatus) =>
  ({
    [TransactionStatus.CONFIRM]: {
      title: t('transaction.confirm_transaction'),
      subtitle: t('transaction.confirm_transaction_wallet')
    },
    [TransactionStatus.SUBMITTING]: {
      title: t('transaction.transaction_processing')
    },
    [TransactionStatus.ERROR]: {
      title: t('transaction.transaction_failed')
    },
    [TransactionStatus.SUCCESS]: {
      title: t('transaction.transaction_successful')
    }
  }[variant]);

const getIcon = (variant: TransactionStatus) => {
  switch (variant) {
    case TransactionStatus.CONFIRM:
    case TransactionStatus.SUBMITTING:
      return <LoadingSpinner variant='indeterminate' diameter={64} thickness={6} />;
    case TransactionStatus.ERROR:
      return <StyledXCircle color='error' />;
    case TransactionStatus.SUCCESS:
      return <StyledCheckCircle color='success' />;
  }
};

const TransactionModal = (): JSX.Element => {
  const { t } = useTranslation();

  const notifications = useNotifications();

  const { isOpen, data } = useSelector((state: StoreType) => state.general.transactionModal);
  const { variant, description, url, timestamp, errorMessage } = data;
  const dispatch = useDispatch();

  const { title, subtitle } = getData(t, variant);

  const hasDismiss = variant !== TransactionStatus.CONFIRM;

  const icon = getIcon(variant);

  const handleClose = () => {
    // Only show toast if the current transaction variant is CONFIRM or SUBMITTING.
    // No need to show toast if the transaction is SUCCESS or ERROR
    if (timestamp && (variant === TransactionStatus.CONFIRM || variant === TransactionStatus.SUBMITTING)) {
      notifications.show(timestamp, {
        type: NotificationToast.TRANSACTION,
        props: { variant: variant, url, description }
      });
    }

    dispatch(updateTransactionModal(false, data));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader align='start'>{title}</ModalHeader>
      <ModalBody alignItems='center' gap='spacing4'>
        {icon}
        <Flex alignSelf='normal' direction='column' justifyContent='center' alignItems='center' gap='spacing4'>
          {subtitle && (
            <H4 weight='bold' size='base'>
              {subtitle}
            </H4>
          )}
          {description && (
            <P color={errorMessage ? 'error' : undefined} size='s'>
              {description}
            </P>
          )}
          {errorMessage && (
            <StyledCard alignSelf='normal' flex={1} justifyContent='flex-start' background='secondary'>
              <H5 weight='bold' size='xs'>
                Message:
              </H5>
              <P size='xs' weight='light'>
                {errorMessage}
              </P>
            </StyledCard>
          )}
          {url && (
            <TextLink color='secondary' size='s' external icon to={url}>
              View transaction on Subscan
            </TextLink>
          )}
        </Flex>
      </ModalBody>
      <ModalFooter>{hasDismiss && <CTA onPress={handleClose}>{t('dismiss')}</CTA>}</ModalFooter>
    </Modal>
  );
};

export { TransactionModal };
