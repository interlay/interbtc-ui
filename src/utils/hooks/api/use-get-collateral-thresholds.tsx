import {
  CollateralCurrency,
  CollateralIdLiteral,
  CollateralUnit,
  currencyIdLiteralToMonetaryCurrency
} from '@interlay/interbtc-api';
import Big from 'big.js';
import { useQuery, UseQueryResult } from 'react-query';

import { VAULT_COLLATERAL } from '@/config/vaults';

// TODO: Refactor with currencies update
type AllCollateralThresholds = { [currencySymbol in CollateralIdLiteral]: CollateralThresholds };

type CollateralThresholds = {
  liquidationThreshold: Big;
  secureThreshold: Big;
};

const getThresholds = async (collateralCurrencyLiteral: CollateralIdLiteral): Promise<CollateralThresholds> => {
  try {
    // TODO: Need to refactor this after currency updates are merged.
    const currency = currencyIdLiteralToMonetaryCurrency<CollateralUnit>(
      window.bridge.api,
      collateralCurrencyLiteral
    ) as CollateralCurrency;

    const liquidationThreshold = await window.bridge.vaults.getLiquidationCollateralThreshold(currency);
    const secureThreshold = await window.bridge.vaults.getSecureCollateralThreshold(currency);

    return { liquidationThreshold, secureThreshold };
  } catch {
    throw new Error(`useGetCollateralThresholds: error getting thresholds for currency ${collateralCurrencyLiteral}.`);
  }
};

const getAllThresholds = async (): Promise<AllCollateralThresholds> => {
  const collateralIdLiterals = VAULT_COLLATERAL;
  const allThresholds = await Promise.all(
    collateralIdLiterals.map((collateralIdLiteral) => getThresholds(collateralIdLiteral))
  );
  // TODO: handle types properly
  return allThresholds.reduce(
    (result, thresholds, index) => ({
      ...result,
      [collateralIdLiterals[index]]: thresholds
    }),
    {}
  ) as AllCollateralThresholds;
};

const useGetCollateralThresholds = (bridgeLoaded: boolean): UseQueryResult<AllCollateralThresholds> => {
  return useQuery({ queryKey: 'getAllThresholds', queryFn: getAllThresholds, enabled: bridgeLoaded });
};

export { useGetCollateralThresholds };
