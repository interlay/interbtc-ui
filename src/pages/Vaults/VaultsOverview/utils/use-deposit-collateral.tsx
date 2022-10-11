import { CollateralCurrencyExt, CollateralIdLiteral, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN, GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { useGetBalances } from '@/utils/contexts/balances';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const getAvailableGovernanceBalance = (balance: MonetaryAmount<CurrencyExt>): MonetaryAmount<CurrencyExt> => {
  const availableBalance = balance.sub(extraRequiredCollateralTokenAmount);

  return availableBalance.toBig().gte(0) ? availableBalance : newMonetaryAmount(0, GOVERNANCE_TOKEN);
};

// TODO: move into common hook for fees
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

const useDepositCollateral = (collateralCurrency: CollateralCurrencyExt, minCollateral: Big): UseDepositCollateral => {
  const { data: balances } = useGetBalances();
  const prices = useGetPrices();

  const collateralUSDAmount = getTokenPrice(prices, collateralCurrency.ticker as CollateralIdLiteral)?.usd || 0;
  const minCollateralAmount = newMonetaryAmount(minCollateral, collateralCurrency);

  const isGovernanceCollateral = collateralCurrency === GOVERNANCE_TOKEN;
  const freeGovernanceBalance = balances?.[GOVERNANCE_TOKEN.ticker].free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const collateralTokenBalance = balances?.[collateralCurrency.ticker].free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
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
        amount: balanceToken.toString(),
        usd: displayMonetaryAmountInUSDFormat(balanceToken, collateralUSDAmount),
        raw: balanceToken
      },
      min: {
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
