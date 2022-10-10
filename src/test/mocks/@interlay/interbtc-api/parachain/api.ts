import { Text, TypeRegistry } from '@polkadot/types';
import { Registry } from '@polkadot/types/types';

const mockApiCreateType = jest.fn(<T extends unknown>(type: string, data: T) => data);

const mockRegistry = ({ chainDecimals: [], chainSS58: 0, chainTokens: [] } as unknown) as Registry;

const mockSystemChain = jest.fn().mockReturnValue(new Text(mockRegistry, 'interBTC')) as any;

const registry = new TypeRegistry();

const mockChainType = jest.fn().mockReturnValue(registry.createType('ChainType', 'Live')) as any;

export { mockApiCreateType, mockChainType, mockSystemChain };
