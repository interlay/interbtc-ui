import { CollateralIdLiteral, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN, GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { useGovernanceTokenBalance } from '@/services/hooks/use-token-balance';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getCurrency } from '@/utils/helpers/currencies';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const getAvailableGovernanceBalance = (balance: MonetaryAmount<CurrencyExt>): MonetaryAmount<CurrencyExt> => {
  const availableBalance = balance.sub(extraRequiredCollateralTokenAmount);

  return availableBalance.toBig().gte(0) ? availableBalance : newMonetaryAmount(0, GOVERNANCE_TOKEN);
};

let EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT: number;
if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
  EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT = 0.2;
} else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
  EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT = 0.01;
} else {
  throw new Error('Something went wrong!');
}
const extraRequiredCollateralTokenAmount = newMonetaryAmount(
  EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT,
  GOVERNANCE_TOKEN,
  true
);

type UseDepositCollateral = {
  collateral: {
    currency: CurrencyExt;
    isGovernanceToken: boolean;
    price: {
      usd: number;
    };
    balance: {
      amount: string;
      usd: string;
      raw: MonetaryAmount<CurrencyExt>;
    };
    min: {
      isLoading: boolean;
      amount: string;
      usd: string;
      raw: MonetaryAmount<CurrencyExt>;
    };
  };
  governance: {
    raw: MonetaryAmount<CurrencyExt>;
  };
  fee: {
    amount: string;
    usd: string;
    raw: MonetaryAmount<CurrencyExt>;
  };
};

const useDepositCollateral = (collateralToken: CollateralIdLiteral): UseDepositCollateral => {
  const { bridgeLoaded, collateralTokenBalance } = useSelector((state: StoreType) => state.general);
  const { governanceTokenBalance } = useGovernanceTokenBalance();
  const prices = useGetPrices();

  const collateralCurrency = getCurrency(collateralToken);
  const {
    isIdle: minCollateralIdle,
    isLoading: minCollateralLoading,
    data: minCollateral,
    error: minCollateralError
  } = useQuery<Big, Error>(
    [GENERIC_FETCHER, 'vaults', 'getMinimumCollateral', collateralCurrency],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(minCollateralError);

  const minCollateralValue = minCollateral || new Big(0);
  const collateralUSDAmount = getTokenPrice(prices, collateralToken)?.usd || 0;
  const minCollateralAmount = newMonetaryAmount(minCollateralValue, collateralCurrency);

  const isGovernanceCollateral = collateralCurrency === GOVERNANCE_TOKEN;
  const freeGovernanceBalance = governanceTokenBalance?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const balanceToken = isGovernanceCollateral
    ? getAvailableGovernanceBalance(freeGovernanceBalance)
    : collateralTokenBalance;

  return {
    collateral: {
      currency: collateralCurrency,
      isGovernanceToken: isGovernanceCollateral,
      price: {
        usd: collateralUSDAmount
      },
      balance: {
        amount: displayMonetaryAmount(balanceToken),
        usd: displayMonetaryAmountInUSDFormat(balanceToken, collateralUSDAmount),
        raw: balanceToken
      },
      min: {
        isLoading: minCollateralIdle || minCollateralLoading,
        amount: displayMonetaryAmount(minCollateralAmount),
        usd: displayMonetaryAmountInUSDFormat(minCollateralAmount, collateralUSDAmount),
        raw: minCollateralAmount
      }
    },
    fee: {
      amount: displayMonetaryAmount(extraRequiredCollateralTokenAmount),
      usd: displayMonetaryAmountInUSDFormat(
        extraRequiredCollateralTokenAmount,
        getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
      ),
      raw: extraRequiredCollateralTokenAmount
    },
    governance: {
      raw: freeGovernanceBalance
    }
  };
};

export { useDepositCollateral };
