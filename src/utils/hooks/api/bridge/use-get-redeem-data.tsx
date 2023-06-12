import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetExchangeRate } from '../use-get-exchange-rate';

const getPremiumRedeemVaults = async () => {
  try {
    const premiumRedeemVaults = await window.bridge.vaults.getPremiumRedeemVaults();

    return premiumRedeemVaults.size > 0;
  } catch (e) {
    return new Map();
  }
};

type RedeemData = {
  dustValue: MonetaryAmount<Currency>;
  premiumRedeemFeeRate: Big;
  hasPremiumRedeemVaults: boolean;
  feeRate: BitcoinAmount;
  currentInclusionFee: MonetaryAmount<Currency>;
  redeemLimit: MonetaryAmount<Currency>;
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
    checkPremiumRedeemVaults(),
    window.bridge.redeem.getFeeRate(),
    window.bridge.redeem.getCurrentInclusionFee(),
    window.bridge.vaults.getVaultsWithRedeemableTokens()
  ]);

  const redeemLimit = vaultsWithRedeemableTokens.values().next().value;

  return {
    dustValue,
    redeemLimit,
    premiumRedeemFeeRate,
    premiumRedeemVaults,
    feeRate: new BitcoinAmount(feeRate),
    currentInclusionFee
  };
};

type UseGetRedeemDataResult = {
  data: RedeemData | undefined;
  getSecurityDeposit: (btcAmount: MonetaryAmount<Currency>) => MonetaryAmount<Currency> | undefined;
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

  const getSecurityDeposit = useCallback(
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
    getSecurityDeposit
  };
};

export { useGetRedeemData };
export type { RedeemData, UseGetRedeemDataResult };
