import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetExchangeRate } from '../use-get-exchange-rate';

type IssueData = {
  dustValue: MonetaryAmount<Currency>;
  premiumRedeemFeeRate: Big;
  hasPremiumRedeemVaults: boolean;
  feeRate: Big;
  currentInclusionFee: MonetaryAmount<Currency>;
};

const getIssueData = async (): Promise<IssueData> => {
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
    window.bridge.vaults.getPremiumRedeemVaults(),
    window.bridge.redeem.getFeeRate(),
    window.bridge.redeem.getCurrentInclusionFee(),
    window.bridge.vaults.getVaultsWithRedeemableTokens()
  ]);

  const hasPremiumRedeemVaults = premiumRedeemVaults.size > 0;

  const redeemLimit = vaultsWithRedeemableTokens.values().next().value;

  console.log(redeemLimit);

  return {
    dustValue,
    premiumRedeemFeeRate,
    hasPremiumRedeemVaults,
    feeRate,
    currentInclusionFee
  };
};

type UseGetRedeemDataResult = {
  data: IssueData | undefined;
  getSecurityDeposit: (btcAmount: MonetaryAmount<Currency>) => MonetaryAmount<Currency> | undefined;
  refetch: () => void;
};

const useGetRedeemData = (): UseGetRedeemDataResult => {
  const { data: btcToGovernanceToken } = useGetExchangeRate(GOVERNANCE_TOKEN);

  const { data, error, refetch } = useQuery({
    queryKey: 'dust-value',
    queryFn: getIssueData,
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
export type { IssueData, UseGetRedeemDataResult };
