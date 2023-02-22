import { BorrowPosition, CurrencyExt, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const DEFAULT_LEND_TOKENS: CurrencyExt[] = [];

const DEFAULT_IBTC = {
  AMOUNT: { VERY_SMALL: '0.01', SMALL: '0.1', MEDIUM: '1', LARGE: '10', VERY_LARGE: '100' },
  MONETARY: {
    VERY_SMALL: newMonetaryAmount(0.01, WRAPPED_TOKEN, true),
    SMALL: newMonetaryAmount(0.1, WRAPPED_TOKEN, true),
    MEDIUM: newMonetaryAmount(1, WRAPPED_TOKEN, true),
    LARGE: newMonetaryAmount(10, WRAPPED_TOKEN, true),
    VERY_LARGE: newMonetaryAmount(100, WRAPPED_TOKEN, true)
  }
};

const DEFAULT_INTR = {
  AMOUNT: { VERY_SMALL: '10', SMALL: '100', MEDIUM: '1000', LARGE: '10000', VERY_LARGE: '100000' },
  MONETARY: {
    VERY_SMALL: newMonetaryAmount(10, GOVERNANCE_TOKEN, true),
    SMALL: newMonetaryAmount(100, GOVERNANCE_TOKEN, true),
    MEDIUM: newMonetaryAmount(1000, GOVERNANCE_TOKEN, true),
    LARGE: newMonetaryAmount(10000, GOVERNANCE_TOKEN, true),
    VERY_LARGE: newMonetaryAmount(100000, GOVERNANCE_TOKEN, true)
  }
};

const DEFAULT_APY = {
  IBTC: {
    BASE: '10.20',
    LEND: '10.48',
    BORROW: '9.92'
  },
  INTR: {
    BASE: '10.20',
    LEND: '10.20',
    BORROW: '10.20'
  }
};

const DEFAULT_POSITIONS = {
  LEND: {
    IBTC: {
      currency: WRAPPED_TOKEN,
      amount: DEFAULT_IBTC.MONETARY.MEDIUM,
      isCollateral: true,
      earnedInterest: DEFAULT_IBTC.MONETARY.VERY_SMALL
    } as LendPosition,
    INTR: {
      currency: GOVERNANCE_TOKEN,
      amount: DEFAULT_INTR.MONETARY.MEDIUM,
      isCollateral: true,
      earnedInterest: DEFAULT_INTR.MONETARY.SMALL
    } as LendPosition
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

const DEFAULT_LEND_POSITIONS: LendPosition[] = [DEFAULT_POSITIONS.LEND.IBTC];

const DEFAULT_BORROW_POSITIONS: BorrowPosition[] = [DEFAULT_POSITIONS.BORROW.IBTC];

const DEFAULT_ASSETS: TickerToData<LoanAsset> = {
  IBTC: {
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
    totalBorrows: DEFAULT_IBTC.MONETARY.VERY_LARGE,
    borrowCap: DEFAULT_IBTC.MONETARY.VERY_LARGE,
    supplyCap: DEFAULT_IBTC.MONETARY.VERY_LARGE
  },
  INTR: {
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
    totalBorrows: DEFAULT_INTR.MONETARY.VERY_SMALL,
    borrowCap: DEFAULT_INTR.MONETARY.VERY_LARGE,
    supplyCap: DEFAULT_INTR.MONETARY.VERY_LARGE
  }
};

const mockGetLendPositionsOfAccount = jest.fn().mockReturnValue(DEFAULT_LEND_POSITIONS);
const mockGetBorrowPositionsOfAccount = jest.fn().mockRejectedValue(DEFAULT_BORROW_POSITIONS);
const mockGetLoanAssets = jest.fn().mockReturnValue(DEFAULT_ASSETS);
const mockGetAccountSubsidyRewards = jest.fn().mockReturnValue(DEFAULT_INTR.MONETARY.MEDIUM);

const mockLend = jest.fn();
const mockWithdraw = jest.fn();
const mockWithdrawAll = jest.fn();
const mockBorrow = jest.fn();
const mockRepay = jest.fn();
const mockRepayAll = jest.fn();

const mockEnableAsCollateral = jest.fn();
const mockDisableAsCollateral = jest.fn();

const mockClaimAllSubsidyRewards = jest.fn();

const mockGetLendTokens = jest.fn(() => DEFAULT_LEND_TOKENS);

export {
  DEFAULT_APY,
  DEFAULT_ASSETS,
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_POSITIONS,
  mockBorrow,
  mockClaimAllSubsidyRewards,
  mockDisableAsCollateral,
  mockEnableAsCollateral,
  mockGetAccountSubsidyRewards,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount,
  mockGetLoanAssets,
  mockLend,
  mockRepay,
  mockRepayAll,
  mockWithdraw,
  mockWithdrawAll
};

export { mockGetLendTokens };
