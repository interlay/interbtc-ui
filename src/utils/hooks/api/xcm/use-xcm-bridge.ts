import { ApiProvider, Bridge, ChainName } from '@interlay/bridge/build';
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

  const { error } = queryResult;

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

  useErrorHandler(error);

  return { ...queryResult, getOriginatingChains, getDestinationChains, getAvailableTokens };
};

export { useXCMBridge };
export type { UseXCMBridge };
