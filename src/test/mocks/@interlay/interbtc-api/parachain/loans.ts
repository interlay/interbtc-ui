import {
  BorrowPosition,
  CollateralPosition,
  CurrencyExt,
  LendingStats,
  LoanAsset,
  LoanPosition,
  LoansAPI,
  newMonetaryAmount,
  TickerToData
} from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { CollateralActions } from '@/pages/Vaults/Vault/types';

const WRAPPED_ASSET_AMOUNT = {
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

const WRAPPED_ASSET_LEND: Record<'NON_COLLATERAL' | 'COLLATERAL', CollateralPosition> = {
  NON_COLLATERAL: {
    amount: WRAPPED_ASSET_AMOUNT.MEDIUM.MONETARY,
    isCollateral: false
  },
  COLLATERAL: {
    amount: WRAPPED_ASSET_AMOUNT.MEDIUM.MONETARY,
    isCollateral: true
  }
};

const WRAPPED_ASSET_BORROW: BorrowPosition = {
  amount: WRAPPED_ASSET_AMOUNT.MEDIUM.MONETARY,
  accumulatedDebt: WRAPPED_ASSET_AMOUNT.VERY_SMALL.MONETARY
};

const WRAPPED_ASSET = {
  AMOUNT: WRAPPED_ASSET_AMOUNT,
  POSITIONS: {
    LEND: WRAPPED_ASSET_LEND,
    BORROW: WRAPPED_ASSET_BORROW
  },
  APY: {
    BASE: '10.20',
    LEND: '10.48',
    BORROW: '9.92'
  }
};

const GOVERNANCE_ASSET_AMOUNT = {
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

const GOVERNANCE_ASSET_LEND: Record<'NON_COLLATERAL' | 'COLLATERAL', CollateralPosition> = {
  NON_COLLATERAL: {
    amount: GOVERNANCE_ASSET_AMOUNT.MEDIUM.MONETARY,
    isCollateral: false
  },
  COLLATERAL: {
    amount: GOVERNANCE_ASSET_AMOUNT.MEDIUM.MONETARY,
    isCollateral: true
  }
};

const GOVERNANCE_ASSET_BORROW: BorrowPosition = {
  amount: GOVERNANCE_ASSET_AMOUNT.MEDIUM.MONETARY,
  accumulatedDebt: GOVERNANCE_ASSET_AMOUNT.VERY_SMALL.MONETARY
};

const GOVERNANCE_ASSET = {
  AMOUNT: GOVERNANCE_ASSET_AMOUNT,
  POSITIONS: {
    LEND: GOVERNANCE_ASSET_LEND,
    BORROW: GOVERNANCE_ASSET_BORROW
  },
  APY: {
    BASE: '10.20',
    LEND: '10.20',
    BORROW: '10.20'
  }
};

const LOAN_POSITIONS = {
  LEND: {
    IBTC: {
      currency: WRAPPED_TOKEN,
      amount: DEFAULT_IBTC.MONETARY.MEDIUM,
      isCollateral: true,
      earnedInterest: DEFAULT_IBTC.MONETARY.VERY_SMALL,
      vaultCollateralAmount: DEFAULT_IBTC.MONETARY.EMPTY
    } as CollateralPosition,
    INTR: {
      currency: GOVERNANCE_TOKEN,
      amount: DEFAULT_INTR.MONETARY.MEDIUM,
      isCollateral: true,
      earnedInterest: DEFAULT_INTR.MONETARY.SMALL,
      vaultCollateralAmount: DEFAULT_INTR.MONETARY.EMPTY
    } as CollateralPosition
  },
  BORROW: {
    IBTC: {
      currency: WRAPPED_TOKEN,
      amount: DEFAULT_IBTC.MONETARY.SMALL,
      accumulatedDebt: DEFAULT_IBTC.MONETARY.VERY_SMALL
    },
    INTR: {
      currency: GOVERNANCE_TOKEN,
      amount: DEFAULT_INTR.MONETARY.MEDIUM,
      accumulatedDebt: DEFAULT_INTR.MONETARY.SMALL
    }
  }
};

const DEFAULT_LEND_POSITIONS: CollateralPosition[] = [DEFAULT_POSITIONS.LEND.IBTC];

const DEFAULT_BORROW_POSITIONS: BorrowPosition[] = [DEFAULT_POSITIONS.BORROW.IBTC];

const DEFAULT_IBTC_LOAN_ASSET: LoanAsset = {
  currency: WRAPPED_TOKEN,
  lendApy: new Big(DEFAULT_APY.IBTC.BASE),
  borrowApy: new Big(DEFAULT_APY.IBTC.BASE),
  totalLiquidity: DEFAULT_IBTC.MONETARY.VERY_LARGE,
  lendReward: DEFAULT_INTR.MONETARY.VERY_LARGE,
  borrowReward: DEFAULT_INTR.MONETARY.VERY_LARGE,
  availableCapacity: DEFAULT_IBTC.MONETARY.VERY_LARGE,
  collateralThreshold: new Big(0.6),
  liquidationThreshold: new Big(0.8),
  isActive: true,
  totalBorrows: DEFAULT_IBTC.MONETARY.MEDIUM,
  borrowCap: DEFAULT_IBTC.MONETARY.VERY_LARGE,
  supplyCap: DEFAULT_IBTC.MONETARY.VERY_LARGE,
  exchangeRate: new ExchangeRate(Bitcoin, WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.MEDIUM.toBig())
};

const DEFAULT_INTR_LOAN_ASSET: LoanAsset = {
  currency: GOVERNANCE_TOKEN,
  lendApy: new Big(DEFAULT_APY.INTR.BASE),
  borrowApy: new Big(DEFAULT_APY.INTR.BASE),
  totalLiquidity: DEFAULT_INTR.MONETARY.VERY_SMALL,
  lendReward: null,
  borrowReward: null,
  availableCapacity: DEFAULT_INTR.MONETARY.VERY_SMALL,
  collateralThreshold: new Big(0.6),
  liquidationThreshold: new Big(0.8),
  isActive: true,
  totalBorrows: DEFAULT_INTR.MONETARY.MEDIUM,
  borrowCap: DEFAULT_INTR.MONETARY.VERY_LARGE,
  supplyCap: DEFAULT_INTR.MONETARY.VERY_LARGE,
  exchangeRate: new ExchangeRate(Bitcoin, GOVERNANCE_TOKEN, DEFAULT_IBTC.MONETARY.MEDIUM.toBig())
};

const DEFAULT_ASSETS: TickerToData<LoanAsset> = {
  IBTC: DEFAULT_IBTC_LOAN_ASSET,
  INTR: DEFAULT_INTR_LOAN_ASSET
};

const DEFAULT_THRESOLD = {
  MIN: new Big(0),
  LOW: new Big(0.25),
  MEDIUM: new Big(0.5),
  HIGH: new Big(0.75),
  MAX: new Big(1)
};

const DEFAULT_CALCULATE_BORROW_LIMIT = {
  ltv: DEFAULT_THRESOLD.LOW,
  collateralThresholdWeightedAverage: DEFAULT_THRESOLD.MEDIUM,
  liquidationThresholdWeightedAverage: DEFAULT_THRESOLD.HIGH
};

const mockCalculateLtvAndThresholdsChange = jest.fn().mockReturnValue(DEFAULT_CALCULATE_BORROW_LIMIT);

const mockCalculateBorrowLimitBtcChange = jest.fn().mockReturnValue(DEFAULT_IBTC.MONETARY.LARGE);

const DEFAULT_LENDING_STATS: LendingStats = {
  borrowLimitBtc: DEFAULT_IBTC.MONETARY.LARGE,
  calculateBorrowLimitBtcChange: mockCalculateBorrowLimitBtcChange,
  calculateLtvAndThresholdsChange: mockCalculateLtvAndThresholdsChange,
  collateralThresholdWeightedAverage: new Big(0.5),
  liquidationThresholdWeightedAverage: new Big(0.75),
  ltv: new Big(0.2),
  totalBorrowedBtc: DEFAULT_IBTC.MONETARY.VERY_SMALL,
  totalCollateralBtc: DEFAULT_IBTC.MONETARY.LARGE,
  totalLentBtc: DEFAULT_IBTC.MONETARY.LARGE
};

const DATA = {};

const MODULE: Record<keyof LoansAPI, jest.Mock<any, any>> = {
  lend: jest.fn(),
  borrow: jest.fn(),
  withdraw: jest.fn(),
  withdrawAll: jest.fn(),
  repayAll: jest.fn(),
  repay: jest.fn(),
  claimAllSubsidyRewards: jest.fn(),
  disableAsCollateral: jest.fn(),
  enableAsCollateral: jest.fn(),
  liquidateBorrowPosition: jest.fn(),
  getAccruedRewardsOfAccount: jest.fn(),
  getBorrowerAccountIds: jest.fn(),
  getBorrowPositionsOfAccount: jest.fn().mockResolvedValue(DEFAULT_BORROW_POSITIONS),
  getLendingStats: jest.fn().mockResolvedValue(DEFAULT_LENDING_STATS),
  getLendPositionsOfAccount: jest.fn().mockResolvedValue(DEFAULT_LEND_POSITIONS),
  getLendTokenExchangeRates: jest.fn(),
  getLendTokens: jest.fn().mockResolvedValue([]),
  getLiquidationThresholdLiquidity: jest.fn(),
  getLoanAssets: jest.fn().mockResolvedValue(DEFAULT_ASSETS),
  getLoansMarkets: jest.fn(),
  getUndercollateralizedBorrowers: jest.fn()
};

const MOCK_LOANS = {
  DATA,
  MODULE
};

export { MOCK_LOANS };
