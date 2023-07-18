import {
  AccruedRewards,
  BorrowPosition,
  CollateralPosition,
  LendingStats,
  LoanAsset,
  LoansAPI,
  newMonetaryAmount,
  TickerToData
} from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

import { EXTRINSIC_DATA } from '../extrinsic';

const WRAPPED_LOAN_AMOUNT = {
  EMPTY: {
    VALUE: '0',
    MONETARY: newMonetaryAmount(0, WRAPPED_TOKEN)
  },
  VERY_SMALL: {
    VALUE: '0.0001',
    MONETARY: newMonetaryAmount(0.0001, WRAPPED_TOKEN)
  },
  SMALL: {
    VALUE: '0.001',
    MONETARY: newMonetaryAmount(0.001, WRAPPED_TOKEN)
  },
  MEDIUM: {
    VALUE: '0.1',
    MONETARY: newMonetaryAmount(0.1, WRAPPED_TOKEN)
  },
  LARGE: {
    VALUE: '1',
    MONETARY: newMonetaryAmount(1, WRAPPED_TOKEN)
  },
  VERY_LARGE: {
    VALUE: '10',
    MONETARY: newMonetaryAmount(10, WRAPPED_TOKEN)
  }
};

const WRAPPED_LOAN_LEND: Record<'NON_COLLATERAL' | 'COLLATERAL', CollateralPosition> = {
  NON_COLLATERAL: {
    amount: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY,
    isCollateral: false,
    vaultCollateralAmount: newMonetaryAmount(0, WRAPPED_TOKEN)
  },
  COLLATERAL: {
    amount: WRAPPED_LOAN_AMOUNT.MEDIUM.MONETARY,
    isCollateral: true,
    vaultCollateralAmount: newMonetaryAmount(0, WRAPPED_TOKEN)
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
    MONETARY: newMonetaryAmount(0, GOVERNANCE_TOKEN)
  },
  VERY_SMALL: {
    VALUE: '1',
    MONETARY: newMonetaryAmount(1, GOVERNANCE_TOKEN)
  },
  SMALL: {
    VALUE: '10',
    MONETARY: newMonetaryAmount(10, GOVERNANCE_TOKEN)
  },
  MEDIUM: {
    VALUE: '1000',
    MONETARY: newMonetaryAmount(1000, GOVERNANCE_TOKEN)
  },
  LARGE: {
    VALUE: '10000',
    MONETARY: newMonetaryAmount(10000, GOVERNANCE_TOKEN)
  },
  VERY_LARGE: {
    VALUE: '1000000',
    MONETARY: newMonetaryAmount(1000000, GOVERNANCE_TOKEN)
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

const THRESOLD = {
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
  collateralThreshold: THRESOLD.MEDIUM,
  liquidationThreshold: THRESOLD.HIGH,
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
  collateralThreshold: THRESOLD.MEDIUM,
  liquidationThreshold: THRESOLD.HIGH,
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
    FULL_COLLATERAL: [WRAPPED_LOAN.POSITIONS.LEND.COLLATERAL, GOVERNANCE_LOAN.POSITIONS.LEND.COLLATERAL]
  },
  BORROW: {
    EMPTY: [],
    AVERAGE: [WRAPPED_LOAN.POSITIONS.BORROW],
    FULL: [WRAPPED_LOAN.POSITIONS.BORROW, GOVERNANCE_LOAN.POSITIONS.BORROW]
  }
};

const ASSETS: TickerToData<LoanAsset> = {
  [WRAPPED_ASSET.currency.ticker]: WRAPPED_ASSET,
  [GOVERNANCE_ASSET.currency.ticker]: GOVERNANCE_ASSET
};

const INACTIVE_ASSETS: TickerToData<LoanAsset> = {
  [WRAPPED_ASSET.currency.ticker]: { ...WRAPPED_ASSET, isActive: false },
  [GOVERNANCE_ASSET.currency.ticker]: { ...GOVERNANCE_ASSET, isActive: false }
};

const LTV_THRESHOLD = {
  ltv: THRESOLD.LOW,
  collateralThresholdWeightedAverage: THRESOLD.MEDIUM,
  liquidationThresholdWeightedAverage: THRESOLD.HIGH
};

const COMMON_STATS = {
  collateralThresholdWeightedAverage: THRESOLD.MEDIUM,
  liquidationThresholdWeightedAverage: THRESOLD.HIGH,
  totalLentBtc: WRAPPED_LOAN_AMOUNT.LARGE.MONETARY,
  borrowLimitBtc: WRAPPED_LOAN_AMOUNT.LARGE.MONETARY,
  totalBorrowedBtc: WRAPPED_LOAN_AMOUNT.VERY_SMALL.MONETARY,
  totalCollateralBtc: WRAPPED_LOAN_AMOUNT.LARGE.MONETARY,
  calculateBorrowLimitBtcChange: jest.fn().mockReturnValue(LTV_THRESHOLD),
  calculateLtvAndThresholdsChange: jest.fn().mockReturnValue(WRAPPED_LOAN_AMOUNT.LARGE.MONETARY)
};

const LENDING_STATS: Record<'LOW_LTV' | 'MEDIUM_LTV' | 'HIGH_LTV', LendingStats> = {
  LOW_LTV: {
    ...COMMON_STATS,
    ltv: THRESOLD.MIN
  },
  MEDIUM_LTV: {
    ...COMMON_STATS,
    ltv: THRESOLD.MEDIUM
  },
  HIGH_LTV: {
    ...COMMON_STATS,
    ltv: THRESOLD.HIGH
  }
};

const ACCOUNT_REWARDS: Record<'EMPTY' | 'FULL', AccruedRewards> = {
  EMPTY: {
    perMarket: {
      [WRAPPED_ASSET.currency.ticker]: { lend: null, borrow: null },
      [GOVERNANCE_ASSET.currency.ticker]: { lend: null, borrow: null }
    },
    total: newMonetaryAmount(0, GOVERNANCE_TOKEN)
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
  LTV_THRESHOLD,
  ASSETS,
  INACTIVE_ASSETS,
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
  getLoanAssets: jest.fn().mockResolvedValue(ASSETS),
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
