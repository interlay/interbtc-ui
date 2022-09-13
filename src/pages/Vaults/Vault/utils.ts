import { CollateralStatus, CollateralStatusRanges } from './types';

const getCollateralStatus = (value: number, ranges: CollateralStatusRanges, isInfinity: boolean): CollateralStatus => {
  if (isInfinity) return 'success';
  if (value <= ranges['error'].max) return 'error';
  if (value <= ranges['warning'].max) return 'warning';
  return 'success';
};

export { getCollateralStatus };
