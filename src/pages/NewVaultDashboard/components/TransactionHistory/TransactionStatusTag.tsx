import { useTranslation } from 'react-i18next';

import { LoadingSpinner } from '@/component-library/LoadingSpinner';
import { Status } from '@/component-library/utils/prop-types';

import { StatusTag, StatusTagProps } from '../StatusTag';

type TransationStatus = 'pending' | 'completed' | 'canceled';

const transationStatus: Record<TransationStatus, Status> = {
  pending: 'warning',
  completed: 'success',
  canceled: 'error'
} as const;

type Props = {
  status: TransationStatus;
};

type InheritAttr = Omit<StatusTagProps, keyof Props>;

type TransationStatusTagProps = Props & InheritAttr;

const TransationStatusTag = ({ status, ...props }: TransationStatusTagProps): JSX.Element => {
  const { t } = useTranslation();

  const tagStatus = transationStatus[status];

  return (
    <StatusTag status={tagStatus} {...props}>
      {status === 'pending' && <LoadingSpinner thickness={2} diameter={20} variant='indeterminate' />}
      <span>{t(status)}</span>
    </StatusTag>
  );
};

export { TransationStatusTag };
export type { TransationStatus, TransationStatusTagProps };
