import { InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';
import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetExchangeRate } from '../use-get-exchange-rate';

const getPremiumRedeemVaults = async (): Promise<Map<InterbtcPrimitivesVaultId, MonetaryAmount<Currency>>> =>
  window.bridge.vaults.getPremiumRedeemVaults().catch(() => new Map());

type RedeemData = {
  dustValue: MonetaryAmount<Currency>;
  premiumRedeemFeeRate: Big;
  premiumRedeemVaults: Map<InterbtcPrimitivesVaultId, MonetaryAmount<Currency>>;
  feeRate: BitcoinAmount;
  currentInclusionFee: MonetaryAmount<Currency>;
  redeemLimit: {
    standard: MonetaryAmount<Currency>;
    premium?: MonetaryAmount<Currency>;
  };
};

const getRedeemData = async (): Promise<RedeemData> => {
  const [
    premiumRedeemFeeRate,
    dustValue,
    premiumRedeemVaults,
    feeRate,
    currentInclusionFee,
    vaultsWithRedeemableTokens
  ] = await Promise.all([
    window.bridge.redeem.getPremiumRedeemFeeRate(),
    window.bridge.redeem.getDustValue(),
    getPremiumRedeemVaults(),
    window.bridge.redeem.getFeeRate(),
    window.bridge.redeem.getCurrentInclusionFee(),
    window.bridge.vaults.getVaultsWithRedeemableTokens()
  ]);

  const stardardRedeemLimit = vaultsWithRedeemableTokens.values().next().value;

  const premiumRedeemLimit = premiumRedeemVaults.values().next().value;

  return {
    dustValue,
    redeemLimit: {
      standard: stardardRedeemLimit,
      premium: premiumRedeemLimit
    },
    premiumRedeemFeeRate,
    premiumRedeemVaults,
    feeRate: new BitcoinAmount(feeRate),
    currentInclusionFee
  };
};

type UseGetRedeemDataResult = {
  data: RedeemData | undefined;
  getCompensationAmount: (btcAmount: MonetaryAmount<Currency>) => MonetaryAmount<Currency> | undefined;
  refetch: () => void;
};

const useGetRedeemData = (): UseGetRedeemDataResult => {
  const { data: btcToGovernanceToken } = useGetExchangeRate(GOVERNANCE_TOKEN);

  const { data, error, refetch } = useQuery({
    queryKey: 'redeem-data',
    queryFn: getRedeemData,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const getCompensationAmount = useCallback(
    (btcAmount: MonetaryAmount<Currency>) => {
      const { premiumRedeemFeeRate } = data || {};

      if (!btcToGovernanceToken || !premiumRedeemFeeRate) return;

      return btcToGovernanceToken.toCounter(btcAmount).mul(premiumRedeemFeeRate);
    },
    [btcToGovernanceToken, data]
  );

  return {
    data,
    refetch,
    getCompensationAmount
  };
};

export { useGetRedeemData };
export type { RedeemData, UseGetRedeemDataResult };
