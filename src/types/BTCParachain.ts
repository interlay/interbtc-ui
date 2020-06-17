import { ApiPromise, WsProvider } from '@polkadot/api';

interface BTCParachainInterface {
  wsProvider: WsProvider;
  api?: ApiPromise;

  connect(): Promise<void>;
  getTotalPolkaBTC(): Promise<string>;
  getTotalLockedDOT(): Promise<string>;
  getTotalDOT(): Promise<string>;
  getBalancePolkaBTC(address: string): Promise<string>;
  getBalanceDOT(address: string): Promise<string>;
}

export default BTCParachainInterface;
