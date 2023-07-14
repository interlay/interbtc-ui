import { InterbtcPrimitivesVaultId, newMonetaryAmount } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetExchangeRate } from '../use-get-exchange-rate';

const getPremiumRedeemVaults = async (): Promise<Map<InterbtcPrimitivesVaultId, MonetaryAmount<Currency>>> =>
  window.bridge.vaults.getPremiumRedeemVaults().catch(() => new Map());

type RedeemData = {
  dustValue: MonetaryAmount<Currency>;
  feeRate: Big;
  redeemLimit: MonetaryAmount<Currency>;
  premium?: {
    feeRate: Big;
    redeemLimit: MonetaryAmount<Currency>;
  };
  currentInclusionFee: MonetaryAmount<Currency>;
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

  const redeemLimit = vaultsWithRedeemableTokens.values().next().value || newMonetaryAmount(0, WRAPPED_TOKEN);

  const premiumRedeemLimit = premiumRedeemVaults.values().next().value || newMonetaryAmount(0, WRAPPED_TOKEN);

  const premium = premiumRedeemLimit
    ? {
        feeRate: premiumRedeemFeeRate,
        redeemLimit: premiumRedeemLimit
      }
    : undefined;

  return {
    dustValue,
    feeRate,
    redeemLimit,
    premium,
    currentInclusionFee
  };
};

type UseGetRedeemDataResult = {
  data: RedeemData | undefined;
  getCompensationAmount: (btcAmount: MonetaryAmount<Currency>) => MonetaryAmount<Currency> | undefined;
  refetch: () => void;
};

const useGetRedeemData = (): UseGetRedeemDataResult => {
  const { data: btcToRelayChainToken } = useGetExchangeRate(RELAY_CHAIN_NATIVE_TOKEN);

  const { data, error, refetch } = useQuery({
    queryKey: 'redeem-data',
    queryFn: getRedeemData,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const getCompensationAmount = useCallback(
    (btcAmount: MonetaryAmount<Currency>) => {
      if (!btcToRelayChainToken || !data?.premium) return;

      return btcToRelayChainToken.toCounter(btcAmount).mul(data.premium.feeRate);
    },
    [btcToRelayChainToken, data]
  );

  return {
    data,
    refetch,
    getCompensationAmount
  };
};

export { useGetRedeemData };
export type { RedeemData, UseGetRedeemDataResult };
