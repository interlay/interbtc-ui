import { ChainName } from '@interlay/bridge';

type ChainData = {
  display: string;
  id: ChainName;
};

type Chains = ChainData[];

export type { ChainData, Chains };
