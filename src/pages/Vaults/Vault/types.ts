import { Status } from '@/component-library/utils/prop-types';
import { TreasuryAction } from '@/types/general.d';

type CollateralActions = 'deposit' | 'withdraw';

type VaultActions = CollateralActions | TreasuryAction;

type CollateralStatus = Status;

type CollateralStatusRanges = Record<CollateralStatus, { min: number; max: number }>;

export type { CollateralActions, CollateralStatus, CollateralStatusRanges, VaultActions };
