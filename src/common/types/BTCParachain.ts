import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";

interface BTCParachainInterface {
  wsProvider: WsProvider;
  api?: ApiPromise;
  keyring?: Keyring;

  connect(): Promise<void>;
  getTotalPolkaBTC(): Promise<string>;
  getTotalLockedDOT(): Promise<string>;
  getTotalDOT(): Promise<string>;
  getBalancePolkaBTC(address: string): Promise<string>;
  getBalanceDOT(address: string): Promise<string>;
}

export default BTCParachainInterface;
