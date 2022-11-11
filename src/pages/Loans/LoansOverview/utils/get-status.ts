import { Status } from '@/component-library';

const borrowStatus: Record<Status, number> = {
  error: 1.1,
  warning: 3.3,
  success: 10
};

const getStatus = (score = 0): Status => {
  if (score <= borrowStatus.error) return 'error';
  if (score <= borrowStatus.warning) return 'warning';
  return 'success';
};

const statusLabel: Record<Status, string> = {
  error: 'Liquidated',
  warning: 'High Risk',
  success: 'Low Risk'
};

const getStatusLabel = (status: Status): string => statusLabel[status];

export { borrowStatus, getStatus, getStatusLabel };
