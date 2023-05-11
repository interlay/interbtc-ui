import { ApiProvider, Bridge, ChainName, CrossChainInputConfigs } from '@interlay/bridge/build';
import { BaseCrossChainAdapter } from '@interlay/bridge/build/base-chain-adapter';
import { atomicToBaseAmount, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
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

import { getXCMEndpoints } from './get-xcm-endpoints';

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
  destFee: MonetaryAmount<CurrencyExt>;
  originFee: string;
  minTransferAmount: Big;
  value: string;
};

type GetTransferableBalancesResult = Promise<{ ticker: any; inputConfig: CrossChainInputConfigs }[] | undefined>;

type UseXCMBridge = UseQueryResult<XCMBridgeData | undefined> & {
  originatingChains: Chains | undefined;
  getDestinationChains: (chain: ChainName) => Chains;
  getAvailableTokens: (
    from: ChainName,
    to: ChainName,
    originAddress: string,
    destinationAddress: string
  ) => Promise<XCMTokenData[] | undefined>;
  getTransferableBalances: (
    from: ChainName,
    to: ChainName,
    originAddress: string,
    destinationAddress: string,
    tokens: string[]
  ) => GetTransferableBalancesResult;
};

const initXCMBridge = async () => {
  const XCMProvider = new ApiProvider();
  const chains = Object.keys(XCM_ADAPTERS) as ChainName[];

  await firstValueFrom(XCMProvider.connectFromChain(chains, getXCMEndpoints(chains)));

  // Set Apis
  await Promise.all(chains.map((chain: ChainName) => XCMBridge.findAdapter(chain).setApi(XCMProvider.getApi(chain))));

  return { provider: XCMProvider, bridge: XCMBridge };
};

const useXCMBridge = (): UseXCMBridge => {
  const queryKey = ['available-xcm-channels'];

  const queryResult = useQuery({
    queryKey,
    queryFn: initXCMBridge
  });

  const { data, error } = queryResult;
  const prices = useGetPrices();

  const originatingChains = data?.bridge.adapters.map((adapter: BaseCrossChainAdapter) => {
    return {
      display: adapter.chain.display,
      id: adapter.chain.id
    };
  });

  const getDestinationChains = useCallback(
    (chain: ChainName): Chains => {
      return XCMBridge.router
        .getDestinationChains({ from: chain })
        .filter((destinationChain) =>
          originatingChains?.some((originatingChain) => originatingChain.id === destinationChain.id)
        );
    },
    [originatingChains]
  );

  const getAvailableTokens = useCallback(
    async (from: ChainName, to: ChainName, originAddress: string, destinationAddress: string) => {
      if (!data) return;

      const tokens = XCMBridge.router.getAvailableTokens({ from, to });

      const inputConfigs = await Promise.all(
        tokens.map(async (token) => {
          const inputConfig = await firstValueFrom(
            data.bridge.findAdapter(from).subscribeInputConfigs({
              to,
              token,
              address: destinationAddress,
              signer: originAddress
            })
          );

          // TODO: resolve type mismatch with BaseCrossChainAdapter and remove `any`
          const originAdapter = data.bridge.findAdapter(from) as any;

          const maxInputToBig = Big(inputConfig.maxInput.toString());
          const minInputToBig = Big(inputConfig.minInput.toString());

          // Never show less than zero
          const transferableBalance = inputConfig.maxInput < inputConfig.minInput ? 0 : maxInputToBig;
          const currency = XCMBridge.findAdapter(from).getToken(token, from);

          const nativeToken = originAdapter.getNativeToken();

          const amount = newMonetaryAmount(transferableBalance, (currency as unknown) as CurrencyExt, true);
          const balanceUSD = convertMonetaryAmountToValueInUSD(amount, getTokenPrice(prices, token)?.usd);
          const originFee = atomicToBaseAmount(inputConfig.estimateFee, nativeToken as CurrencyExt);
          const destFee = newMonetaryAmount(
            new Big(inputConfig.destFee.balance.toNumber()),
            inputConfig.destFee.token as CurrencyExt,
            true
          );
          return {
            balance: transferableBalance.toString(),
            balanceUSD: formatUSD(balanceUSD || 0, { compact: true }),
            destFee,
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

  const getTransferableBalances = useCallback(
    async (from: ChainName, to: ChainName, originAddress: string, destinationAddress: string, tokens: any[]) => {
      if (!data) return;

      const inputConfigs = await Promise.all(
        tokens.map(async (token) => {
          const inputConfig = await firstValueFrom(
            data.bridge.findAdapter(from).subscribeInputConfigs({
              to,
              token: token.ticker,
              address: destinationAddress,
              signer: originAddress
            })
          );

          return { ticker: token.ticker, inputConfig };
        })
      );

      return inputConfigs;
    },
    [data]
  );

  useErrorHandler(error);

  return {
    ...queryResult,
    originatingChains,
    getDestinationChains,
    getAvailableTokens,
    getTransferableBalances
  };
};

export { useXCMBridge };
export type { UseXCMBridge, XCMTokenData };
