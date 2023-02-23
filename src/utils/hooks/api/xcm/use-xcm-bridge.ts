import { ApiProvider, Bridge, ChainName } from '@interlay/bridge/build';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { firstValueFrom } from 'rxjs';

import { XCM_ADAPTERS } from '@/config/relay-chains';
import { BITCOIN_NETWORK } from '@/constants';
import { Chains } from '@/types/chains';

import { getXCMEndpoints } from './get-xcm-endpoints';

const XCMNetwork = BITCOIN_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

const XCMBridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

type XCMBridgeData = {
  bridge: Bridge;
  provider: ApiProvider;
};

type UseXCMBridge = UseQueryResult<XCMBridgeData | undefined> & {
  getOriginatingChains: () => Chains;
  getDestinationChains: (chain: ChainName) => Chains;
  getAvailableTokens: (from: ChainName, to: ChainName) => string[];
  getInputConfigs: (
    from: ChainName,
    to: ChainName,
    token: string,
    destinationAddress: string,
    originAddress: string
  ) => any;
  getTransferableBalances: (
    from: ChainName,
    to: ChainName,
    originAddress: string,
    destinationAddress: string,
    tokens: string[]
  ) => any;
};

const initXCMBridge = async () => {
  const XCMProvider = new ApiProvider(XCMNetwork);
  const chains = Object.keys(XCM_ADAPTERS) as ChainName[];

  // TODO: Get rid of any casting - mismatch between ApiRx types
  await firstValueFrom(XCMProvider.connectFromChain(chains, getXCMEndpoints(chains)) as any);

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

  const getOriginatingChains = useCallback(
    (): Chains =>
      XCMBridge.adapters.map((adapter: any) => {
        return {
          display: adapter.chain.display,
          id: adapter.chain.id
        };
      }),
    []
  );

  const getDestinationChains = useCallback((chain: ChainName): Chains => {
    return XCMBridge.router.getDestinationChains({ from: chain });
  }, []);

  const getAvailableTokens = useCallback(
    (from: ChainName, to: ChainName): string[] => XCMBridge.router.getAvailableTokens({ from, to }),
    []
  );

  const getInputConfigs = useCallback(
    async (from: ChainName, to: ChainName, token: string, destinationAddress: string, originAddress: string) =>
      await firstValueFrom(
        XCMBridge.findAdapter(from).subscribeInputConfigs({
          to,
          token,
          address: destinationAddress,
          signer: originAddress
        }) as any
      ),
    []
  );

  const getTransferableBalances = useCallback(
    async (from: ChainName, to: ChainName, originAddress: string, destinationAddress: string, tokens: any[]) => {
      if (!data) return;

      const inputConfigs = await Promise.all(
        tokens.map(
          async (token): Promise<any> => {
            const inputConfig: any = await firstValueFrom(
              data.bridge.findAdapter(from).subscribeInputConfigs({
                to,
                token: token.ticker,
                address: destinationAddress,
                signer: originAddress
              }) as any
            );

            const maxInput = Big(inputConfig.maxInput.toString());
            console.log('in the promise', maxInput, token.ticker);

            return { ticker: token.ticker, maxInput };
          }
        )
      );

      console.log('input configs in utility', inputConfigs);
      return inputConfigs;
    },
    [data]
  );

  useErrorHandler(error);

  return {
    ...queryResult,
    getOriginatingChains,
    getDestinationChains,
    getAvailableTokens,
    getInputConfigs,
    getTransferableBalances
  };
};

export { useXCMBridge };
export type { UseXCMBridge };
