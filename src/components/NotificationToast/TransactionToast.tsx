import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { updateTransactionModal } from '@/common/actions/general.actions';
import { CTA, CTALink } from '@/component-library';
import { TransactionStatus } from '@/hooks/transaction/types';

import { NotificationToast, NotificationToastProps, NotificationToastVariant } from './NotificationToast';

const getData = (t: TFunction, variant: TransactionStatus) =>
  (({
    [TransactionStatus.CONFIRM]: {
      title: t('transaction.confirm_transaction'),
      status: 'loading'
    },
    [TransactionStatus.SUBMITTING]: {
      title: t('transaction.transaction_processing'),
      status: 'loading'
    },
    [TransactionStatus.SUCCESS]: {
      title: t('transaction.transaction_successful'),
      status: 'success'
    },
    [TransactionStatus.ERROR]: {
      title: t('transaction.transaction_failed'),
      status: 'error'
    }
  } as Record<TransactionStatus, { title: string; status: NotificationToastVariant }>)[variant]);

type Props = {
  variant?: TransactionStatus;
  url?: string;
  errorMessage?: string;
};

type InheritAttrs = Omit<NotificationToastProps, keyof Props>;

type TransactionToastProps = Props & InheritAttrs;

const TransactionToast = ({
  variant = TransactionStatus.SUCCESS,
  url,
  description,
  errorMessage,
  onDismiss,
  ...props
}: TransactionToastProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleViewDetails = () => {
    dispatch(updateTransactionModal(true, { variant: TransactionStatus.ERROR, description, errorMessage }));
    onDismiss?.();
  };

  const { title, status } = getData(t, variant);

  const action = url ? (
    <CTALink size='small' fullWidth external to={url} variant='text'>
      {t('view_subscan')}
    </CTALink>
  ) : (
    errorMessage && (
      <CTA size='small' fullWidth variant='text' onPress={handleViewDetails}>
        View Details
      </CTA>
    )
  );

  return (
    <NotificationToast
      variant={status}
      action={action}
      title={title}
      description={description}
      onDismiss={onDismiss}
      {...props}
    />
  );
};

export { TransactionToast };
export type { TransactionToastProps };
