import { Status } from '@/component-library/utils/prop-types';

type CollateralActions = 'deposit' | 'withdraw';

type CollateralStatus = Status;

type CollateralStatusRanges = Record<CollateralStatus, { min: number; max: number }>;

export type { CollateralActions, CollateralStatus, CollateralStatusRanges };
