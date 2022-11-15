import { Status } from '@/component-library';

const getStatus = (score = 0, thresholds: Record<Status, number>): Status => {
  if (score <= thresholds.error) return 'error';
  if (score <= thresholds.warning) return 'warning';
  return 'success';
};

const statusLabel: Record<Status, string> = {
  error: 'Liquidated',
  warning: 'High Risk',
  success: 'Low Risk'
};

const getStatusLabel = (status: Status): string => statusLabel[status];

export { getStatus, getStatusLabel };
