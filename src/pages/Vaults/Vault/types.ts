import { Status } from '@/component-library/utils/prop-types';

type CollateralActions = 'deposit' | 'withdraw';

type TreasuryActions = 'issue' | 'redeem';

type VaultActions = CollateralActions | TreasuryActions;

type CollateralStatus = Status;

type CollateralStatusRanges = Record<CollateralStatus, { min: number; max: number }>;

export type { CollateralActions, CollateralStatus, CollateralStatusRanges, TreasuryActions, VaultActions };
