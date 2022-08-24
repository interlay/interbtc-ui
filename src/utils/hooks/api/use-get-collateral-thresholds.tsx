import { CollateralCurrencyExt, CollateralIdLiteral } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useQuery, UseQueryResult } from 'react-query';

import { VAULT_COLLATERAL_TOKENS } from '@/config/vaults';

type AllCollateralThresholds = { [currencySymbol in CollateralIdLiteral]: CollateralThresholds };

type CollateralThresholds = {
  liquidationThreshold: Big;
  secureThreshold: Big;
};

const getThresholds = async (collateralToken: CollateralCurrencyExt): Promise<CollateralThresholds> => {
  try {
    const liquidationThreshold = await window.bridge.vaults.getLiquidationCollateralThreshold(collateralToken);
    const secureThreshold = await window.bridge.vaults.getSecureCollateralThreshold(collateralToken);

    return { liquidationThreshold, secureThreshold };
  } catch {
    throw new Error(`useGetCollateralThresholds: error getting thresholds for currency ${collateralToken.ticker}.`);
  }
};

const getAllThresholds = async (): Promise<AllCollateralThresholds> => {
  const allThresholds = await Promise.all(
    VAULT_COLLATERAL_TOKENS.map((item: CollateralCurrencyExt) => getThresholds(item))
  );
  // TODO: handle types properly
  return allThresholds.reduce(
    (result, thresholds, index) => ({
      ...result,
      [VAULT_COLLATERAL_TOKENS[index].ticker]: thresholds
    }),
    {}
  ) as AllCollateralThresholds;
};

const useGetCollateralThresholds = (bridgeLoaded: boolean): UseQueryResult<AllCollateralThresholds> => {
  return useQuery({ queryKey: 'getAllThresholds', queryFn: getAllThresholds, enabled: bridgeLoaded });
};

export { useGetCollateralThresholds };
