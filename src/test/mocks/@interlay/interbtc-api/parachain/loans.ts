import { LoansAPI, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { AccruedRewards, BorrowPosition, CollateralPosition, LendingStats, LoanAsset } from '@/types/loans';

import { EXTRINSIC_DATA } from '../extrinsic';

const WRAPPED_LOAN_AMOUNT = {
  EMPTY: {
    VALUE: '0',
    MONETARY: newMonetaryAmount(0, WRAPPED_TOKEN, true)
  },
  VERY_SMALL: {
    VALUE: '0.0001',
    MONETARY: newMonetaryAmount(0.0001, WRAPPED_TOKEN, true)
  },
  SMALL: {
    VALUE: '0.001',
    MONETARY: newMonetaryAmount(0.001, WRAPPED_TOKEN, true)
  },
  MEDIUM: {
    VALUE: '0.1',
    MONETARY: newMonetaryAmount(0.1, WRAPPED_TOKEN, true)
  },
  LARGE: {
    VALUE: '1',
    MONETARY: newMonetaryAmount(1, WRAPPED_TOKEN, true)
  },
  VERY_LARGE: {
    VALUE: '10',
    MONETARY: newMonetaryAmount(10, WRAPPED_TOKEN, true)
  }
};

const WRAPPED_LOAN_LEND: Record<'NON_COLLATERAL' | 'COLLATERAL' | 'VAULT_COLLATERAL', CollateralPosition> = {
  NON_COLLATERAL: {
    amount: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY,
    isCollateral: false,
    vaultCollateralAmount: WRAPPED_LOAN_AMOUNT.EMPTY.MONETARY
  },
  COLLATERAL: {
    amount: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY,
    isCollateral: true,
    vaultCollateralAmount: WRAPPED_LOAN_AMOUNT.EMPTY.MONETARY
  },
  VAULT_COLLATERAL: {
    amount: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY,
    isCollateral: false,
    vaultCollateralAmount: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY
  }
};

const WRAPPED_LOAN_BORROW: BorrowPosition = {
  amount: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY,
  accumulatedDebt: WRAPPED_LOAN_AMOUNT.VERY_SMALL.MONETARY
};

const WRAPPED_APY = {
  BASE: '10.20',
  LEND: '10.48',
  BORROW: '9.92'
};

const GOVERNANCE_LOAN_AMOUNT = {
  EMPTY: {
    VALUE: '0',
    MONETARY: newMonetaryAmount(0, GOVERNANCE_TOKEN, true)
  },
  VERY_SMALL: {
    VALUE: '1',
    MONETARY: newMonetaryAmount(1, GOVERNANCE_TOKEN, true)
  },
  SMALL: {
    VALUE: '10',
    MONETARY: newMonetaryAmount(10, GOVERNANCE_TOKEN, true)
  },
  MEDIUM: {
    VALUE: '1000',
    MONETARY: newMonetaryAmount(1000, GOVERNANCE_TOKEN, true)
  },
  LARGE: {
    VALUE: '10000',
    MONETARY: newMonetaryAmount(10000, GOVERNANCE_TOKEN, true)
  },
  VERY_LARGE: {
    VALUE: '1000000',
    MONETARY: newMonetaryAmount(1000000, GOVERNANCE_TOKEN, true)
  }
};

const GOVERNANCE_LOAN_LEND: Record<'NON_COLLATERAL' | 'COLLATERAL', CollateralPosition> = {
  NON_COLLATERAL: {
    amount: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY,
    isCollateral: false,
    vaultCollateralAmount: newMonetaryAmount(0, GOVERNANCE_TOKEN)
  },
  COLLATERAL: {
    amount: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY,
    isCollateral: true,
    vaultCollateralAmount: newMonetaryAmount(0, GOVERNANCE_TOKEN)
  }
};

const GOVERNANCE_LOAN_BORROW: BorrowPosition = {
  amount: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY,
  accumulatedDebt: GOVERNANCE_LOAN_AMOUNT.VERY_SMALL.MONETARY
};

const GOVERNANCE_APY = {
  BASE: '10.20',
  LEND: '10.20',
  BORROW: '10.20'
};

const THRESHOLD = {
  MIN: new Big(0),
  LOW: new Big(0.25),
  MEDIUM: new Big(0.5),
  HIGH: new Big(0.75),
  MAX: new Big(1)
};

const WRAPPED_ASSET: LoanAsset = {
  currency: WRAPPED_TOKEN,
  lendApy: new Big(WRAPPED_APY.BASE),
  borrowApy: new Big(WRAPPED_APY.BASE),
  totalLiquidity: WRAPPED_LOAN_AMOUNT.VERY_LARGE.MONETARY,
  lendReward: GOVERNANCE_LOAN_AMOUNT.VERY_LARGE.MONETARY,
  borrowReward: GOVERNANCE_LOAN_AMOUNT.VERY_LARGE.MONETARY,
  availableCapacity: WRAPPED_LOAN_AMOUNT.VERY_LARGE.MONETARY,
  collateralThreshold: THRESHOLD.MEDIUM,
  liquidationThreshold: THRESHOLD.HIGH,
  isActive: true,
  totalBorrows: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY,
  borrowCap: WRAPPED_LOAN_AMOUNT.VERY_LARGE.MONETARY,
  supplyCap: WRAPPED_LOAN_AMOUNT.VERY_LARGE.MONETARY,
  exchangeRate: new ExchangeRate(Bitcoin, WRAPPED_TOKEN, WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY.toBig())
};

const WRAPPED_LOAN = {
  AMOUNT: WRAPPED_LOAN_AMOUNT,
  POSITIONS: {
    LEND: WRAPPED_LOAN_LEND,
    BORROW: WRAPPED_LOAN_BORROW
  },
  APY: WRAPPED_APY,
  ASSET: WRAPPED_ASSET
};

const GOVERNANCE_ASSET: LoanAsset = {
  currency: GOVERNANCE_TOKEN,
  lendApy: new Big(GOVERNANCE_APY.BASE),
  borrowApy: new Big(GOVERNANCE_APY.BASE),
  totalLiquidity: GOVERNANCE_LOAN_AMOUNT.VERY_SMALL.MONETARY,
  lendReward: null,
  borrowReward: null,
  availableCapacity: GOVERNANCE_LOAN_AMOUNT.VERY_SMALL.MONETARY,
  collateralThreshold: THRESHOLD.MEDIUM,
  liquidationThreshold: THRESHOLD.HIGH,
  isActive: true,
  totalBorrows: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY,
  borrowCap: GOVERNANCE_LOAN_AMOUNT.VERY_LARGE.MONETARY,
  supplyCap: GOVERNANCE_LOAN_AMOUNT.VERY_LARGE.MONETARY,
  exchangeRate: new ExchangeRate(Bitcoin, GOVERNANCE_TOKEN, WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY.toBig())
};

const GOVERNANCE_LOAN = {
  AMOUNT: GOVERNANCE_LOAN_AMOUNT,
  POSITIONS: {
    LEND: GOVERNANCE_LOAN_LEND,
    BORROW: GOVERNANCE_LOAN_BORROW
  },
  APY: GOVERNANCE_APY,
  ASSET: GOVERNANCE_ASSET
};

const LOAN_POSITIONS = {
  LEND: {
    EMPTY: [],
    AVERAGE: [WRAPPED_LOAN.POSITIONS.LEND.NON_COLLATERAL],
    AVERAGE_COLLATERAL: [WRAPPED_LOAN.POSITIONS.LEND.COLLATERAL],
    FULL: [WRAPPED_LOAN.POSITIONS.LEND.NON_COLLATERAL, GOVERNANCE_LOAN.POSITIONS.LEND.NON_COLLATERAL],
    FULL_COLLATERAL: [WRAPPED_LOAN.POSITIONS.LEND.COLLATERAL, GOVERNANCE_LOAN.POSITIONS.LEND.COLLATERAL],
    FULL_VAULT_COLLATERAL: [WRAPPED_LOAN.POSITIONS.LEND.VAULT_COLLATERAL]
  },
  BORROW: {
    EMPTY: [],
    AVERAGE: [WRAPPED_LOAN.POSITIONS.BORROW],
    FULL: [WRAPPED_LOAN.POSITIONS.BORROW, GOVERNANCE_LOAN.POSITIONS.BORROW]
  }
};

const ASSETS: Record<'NORMAL' | 'EMPTY_CAPACITY' | 'OVER_BORROWED' | 'INACTIVE', TickerToData<LoanAsset>> = {
  NORMAL: {
    [WRAPPED_ASSET.currency.ticker]: WRAPPED_ASSET,
    [GOVERNANCE_ASSET.currency.ticker]: GOVERNANCE_ASSET
  },
  EMPTY_CAPACITY: {
    [WRAPPED_ASSET.currency.ticker]: {
      ...WRAPPED_ASSET,
      supplyCap: WRAPPED_LOAN_AMOUNT.EMPTY.MONETARY,
      availableCapacity: WRAPPED_LOAN_AMOUNT.EMPTY.MONETARY
    },
    [GOVERNANCE_ASSET.currency.ticker]: {
      ...GOVERNANCE_ASSET,
      supplyCap: GOVERNANCE_LOAN_AMOUNT.EMPTY.MONETARY,
      availableCapacity: GOVERNANCE_LOAN_AMOUNT.EMPTY.MONETARY
    }
  },
  OVER_BORROWED: {
    [WRAPPED_ASSET.currency.ticker]: {
      ...WRAPPED_ASSET,
      borrowCap: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY,
      totalBorrows: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY
    },
    [GOVERNANCE_ASSET.currency.ticker]: {
      ...GOVERNANCE_ASSET,
      borrowCap: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY,
      totalBorrows: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY
    }
  },
  INACTIVE: {
    [WRAPPED_ASSET.currency.ticker]: { ...WRAPPED_ASSET, isActive: false },
    [GOVERNANCE_ASSET.currency.ticker]: { ...GOVERNANCE_ASSET, isActive: false }
  }
};

const COMMON_THRESHOLDS = {
  collateralThresholdWeightedAverage: THRESHOLD.MEDIUM,
  liquidationThresholdWeightedAverage: THRESHOLD.HIGH
};

const LTV_THRESHOLD: Record<'MIN' | 'MEDIUM' | 'HIGH', ReturnType<LendingStats['calculateLtvAndThresholdsChange']>> = {
  MIN: {
    ...COMMON_THRESHOLDS,
    ltv: THRESHOLD.LOW
  },
  MEDIUM: {
    ...COMMON_THRESHOLDS,
    ltv: THRESHOLD.MEDIUM
  },
  HIGH: {
    ...COMMON_THRESHOLDS,
    ltv: THRESHOLD.HIGH
  }
};

const COMMON_STATS: Omit<LendingStats, 'ltv'> = {
  collateralThresholdWeightedAverage: THRESHOLD.MEDIUM,
  liquidationThresholdWeightedAverage: THRESHOLD.HIGH,
  totalLentBtc: WRAPPED_LOAN_AMOUNT.LARGE.MONETARY,
  borrowLimitBtc: WRAPPED_LOAN_AMOUNT.LARGE.MONETARY,
  totalBorrowedBtc: WRAPPED_LOAN_AMOUNT.VERY_SMALL.MONETARY,
  totalCollateralBtc: WRAPPED_LOAN_AMOUNT.LARGE.MONETARY,
  calculateLtvAndThresholdsChange: jest.fn().mockReturnValue(LTV_THRESHOLD.MIN),
  calculateBorrowLimitBtcChange: jest.fn().mockReturnValue(WRAPPED_LOAN_AMOUNT.LARGE.MONETARY)
};

const LENDING_STATS: Record<
  'LOW_LTV' | 'MEDIUM_LTV' | 'HIGH_LTV' | 'LOW_BORROW_LIMIT' | 'MIN_BORROW_LIMIT' | 'LIQUIDATION',
  LendingStats
> = {
  LOW_LTV: {
    ...COMMON_STATS,
    ltv: THRESHOLD.MIN
  },
  MEDIUM_LTV: {
    ...COMMON_STATS,
    ltv: THRESHOLD.MEDIUM
  },
  HIGH_LTV: {
    ...COMMON_STATS,
    ltv: THRESHOLD.HIGH
  },
  LOW_BORROW_LIMIT: {
    ...COMMON_STATS,
    ltv: THRESHOLD.MEDIUM,
    borrowLimitBtc: WRAPPED_LOAN_AMOUNT.VERY_SMALL.MONETARY,
    calculateBorrowLimitBtcChange: jest.fn().mockReturnValue(WRAPPED_LOAN_AMOUNT.VERY_SMALL.MONETARY)
  },
  MIN_BORROW_LIMIT: {
    ...COMMON_STATS,
    ltv: THRESHOLD.MEDIUM,
    borrowLimitBtc: WRAPPED_LOAN_AMOUNT.EMPTY.MONETARY,
    calculateBorrowLimitBtcChange: jest.fn().mockReturnValue(WRAPPED_LOAN_AMOUNT.EMPTY.MONETARY)
  },
  LIQUIDATION: {
    ...COMMON_STATS,
    ltv: THRESHOLD.LOW,
    calculateLtvAndThresholdsChange: jest.fn().mockReturnValue(LTV_THRESHOLD.HIGH)
  }
};

const ACCOUNT_REWARDS: Record<'EMPTY' | 'FULL', AccruedRewards> = {
  EMPTY: {
    perMarket: {
      [WRAPPED_ASSET.currency.ticker]: { lend: null, borrow: null },
      [GOVERNANCE_ASSET.currency.ticker]: { lend: null, borrow: null }
    },
    total: GOVERNANCE_LOAN_AMOUNT.EMPTY.MONETARY
  },
  FULL: {
    perMarket: {
      [WRAPPED_ASSET.currency.ticker]: {
        lend: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY,
        borrow: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY
      },
      [GOVERNANCE_ASSET.currency.ticker]: {
        lend: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY,
        borrow: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY
      }
    },
    total: GOVERNANCE_LOAN_AMOUNT.MEDIUM.MONETARY
  }
};

const DATA = {
  ASSETS,
  LOAN_POSITIONS,
  WRAPPED_LOAN,
  GOVERNANCE_LOAN,
  LENDING_STATS,
  ACCOUNT_REWARDS
};

const MODULE: Record<keyof LoansAPI, jest.Mock<any, any>> = {
  getAccruedRewardsOfAccount: jest.fn().mockResolvedValue(ACCOUNT_REWARDS.EMPTY),
  getBorrowerAccountIds: jest.fn(),
  getBorrowPositionsOfAccount: jest.fn().mockResolvedValue(LOAN_POSITIONS.BORROW.EMPTY),
  getLendingStats: jest.fn().mockReturnValue(LENDING_STATS.LOW_LTV),
  getLendPositionsOfAccount: jest.fn().mockResolvedValue(LOAN_POSITIONS.LEND.EMPTY),
  getLendTokenExchangeRates: jest.fn(),
  getLendTokens: jest.fn().mockResolvedValue([]),
  getLiquidationThresholdLiquidity: jest.fn(),
  getLoanAssets: jest.fn().mockResolvedValue(ASSETS.NORMAL),
  getLoansMarkets: jest.fn(),
  getUndercollateralizedBorrowers: jest.fn(),
  // MUTATIONS
  lend: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  borrow: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  withdraw: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  withdrawAll: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  repayAll: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  repay: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  claimAllSubsidyRewards: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  disableAsCollateral: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  enableAsCollateral: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  liquidateBorrowPosition: jest.fn().mockResolvedValue(EXTRINSIC_DATA)
};

const MOCK_LOANS = {
  DATA,
  MODULE
};

export { MOCK_LOANS };
