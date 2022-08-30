import { CollateralStatus, CollateralStatusRanges } from './types';

const getCollateralStatus = (value: number, ranges: CollateralStatusRanges): CollateralStatus => {
  if (value <= ranges['error'].max) return 'error';
  if (value <= ranges['warning'].max) return 'warning';
  return 'success';
};

export { getCollateralStatus };
