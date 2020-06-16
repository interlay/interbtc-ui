import { ApiPromise, WsProvider } from '@polkadot/api';

interface BTCParachainInterface {
  wsProvider: WsProvider;
  api?: ApiPromise;

  getTotalPolkaBTC(): Promise<string>;
}

export default BTCParachainInterface;
