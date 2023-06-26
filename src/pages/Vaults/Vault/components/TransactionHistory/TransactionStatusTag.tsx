import { useTranslation } from 'react-i18next';

import { LoadingSpinner } from '@/component-library/LoadingSpinner';
import { Status } from '@/component-library/utils/prop-types';

import { StatusTag, StatusTagProps } from '../StatusTag';

type TransactionStatus = 'pending' | 'cancelled' | 'completed' | 'confirmed' | 'received' | 'retried';

const transactionStatus: Record<TransactionStatus, Status> = {
  pending: 'warning',
  cancelled: 'error',
  completed: 'success',
  confirmed: 'warning',
  received: 'success',
  retried: 'success'
} as const;

type Props = {
  status: TransactionStatus;
};

type InheritAttr = Omit<StatusTagProps, keyof Props>;

type TransactionStatusTagProps = Props & InheritAttr;

const TransactionStatusTag = ({ status, ...props }: TransactionStatusTagProps): JSX.Element => {
  const { t } = useTranslation();

  const tagStatus = transactionStatus[status];

  return (
    <StatusTag status={tagStatus} {...props}>
      {status === 'pending' && <LoadingSpinner thickness={2} diameter={20} variant='indeterminate' />}
      <span>{t(status)}</span>
    </StatusTag>
  );
};

export { TransactionStatusTag };
export type { TransactionStatus, TransactionStatusTagProps };
