import { FixedPointNumber } from '@acala-network/sdk-core';
import { ApiProvider, Bridge, ChainName } from '@interlay/bridge/build';
import { BaseCrossChainAdapter } from '@interlay/bridge/build/base-chain-adapter';
import { atomicToBaseAmount, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { firstValueFrom } from 'rxjs';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { XCM_ADAPTERS } from '@/config/relay-chains';
import { Chains } from '@/types/chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { XCMEndpoints } from './xcm-endpoints';

const XCMBridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

type XCMBridgeData = {
  bridge: Bridge;
  provider: ApiProvider;
};

type XCMTokenData = {
  balance: string;
  balanceUSD: string;
  destFee: FixedPointNumber | undefined;
  originFee: string;
  minTransferAmount: Big;
  value: string;
};

type UseXCMBridge = UseQueryResult<XCMBridgeData | undefined> & {
  originatingChains: Chains | undefined;
  getDestinationChains: (chain: ChainName) => Chains;
  getAvailableTokens: (
    from: ChainName,
    to: ChainName,
    originAddress: string,
    destinationAddress: string
  ) => Promise<XCMTokenData[] | undefined>;
};

const initXCMBridge = async () => {
  const XCMProvider = new ApiProvider();
  const chains = Object.keys(XCM_ADAPTERS) as ChainName[];

  await firstValueFrom(XCMProvider.connectFromChain(chains, XCMEndpoints));

  // Set Apis
  await Promise.all(
    chains.map((chain: ChainName) => {
      return XCMBridge.findAdapter(chain).setApi(XCMProvider.getApi(chain));
    })
  );

  return { provider: XCMProvider, bridge: XCMBridge };
};

const useXCMBridge = (): UseXCMBridge => {
  const queryKey = ['available-xcm-channels'];

  const queryResult = useQuery({
    queryKey,
    queryFn: initXCMBridge,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity
  });

  const { data, error } = queryResult;
  const prices = useGetPrices();

  const originatingChains = data?.bridge.adapters.map((adapter: BaseCrossChainAdapter) => {
    return {
      display: adapter.chain.display,
      id: adapter.chain.id as ChainName
    };
  });

  const getDestinationChains = useCallback(
    (chain: ChainName): Chains => {
      return XCMBridge.router
        .getDestinationChains({ from: chain })
        .filter((destinationChain) =>
          originatingChains?.some((originatingChain) => originatingChain.id === destinationChain.id)
        ) as Chains;
    },
    [originatingChains]
  );

  const getAvailableTokens = useCallback(
    async (from, to, originAddress, destinationAddress) => {
      if (!data) return;

      const tokens = XCMBridge.router.getAvailableTokens({ from, to });

      const inputConfigs = await Promise.all(
        tokens.map(async (token) => {
          const inputConfig =
            !destinationAddress || !originAddress
              ? undefined
              : await firstValueFrom(
                  data.bridge.findAdapter(from).subscribeInputConfigs({
                    to,
                    token,
                    address: destinationAddress,
                    signer: originAddress
                  })
                );

          // TODO: resolve type mismatch with BaseCrossChainAdapter and remove `any`
          const originAdapter = data.bridge.findAdapter(from) as any;

          const maxInputToBig = inputConfig ? Big(inputConfig.maxInput.toString()) : Big(0);
          const minInputToBig = inputConfig ? Big(inputConfig.minInput.toString()) : Big(0);

          // Never show less than zero
          const transferableBalance = inputConfig?.maxInput.isLessThan(inputConfig?.minInput) ? 0 : maxInputToBig;
          const currency = XCMBridge.findAdapter(from).getToken(token, from);

          const nativeToken = originAdapter.getNativeToken();

          const amount = newMonetaryAmount(transferableBalance, (currency as unknown) as CurrencyExt, true);
          const balanceUSD = convertMonetaryAmountToValueInUSD(amount, getTokenPrice(prices, token)?.usd);
          const originFee = inputConfig
            ? atomicToBaseAmount(inputConfig.estimateFee, nativeToken as CurrencyExt)
            : atomicToBaseAmount(0, nativeToken as CurrencyExt);

          return {
            balance: transferableBalance.toString(),
            balanceUSD: formatUSD(balanceUSD || 0, { compact: true }),
            destFee: inputConfig?.destFee.balance,
            originFee: `${originFee.toString()} ${nativeToken.symbol}`,
            minTransferAmount: minInputToBig,
            value: token
          };
        })
      );

      return inputConfigs;
    },
    [data, prices]
  );

  useErrorHandler(error);

  return {
    ...queryResult,
    originatingChains,
    getDestinationChains,
    getAvailableTokens
  };
};

export { useXCMBridge };
export type { UseXCMBridge, XCMTokenData };
