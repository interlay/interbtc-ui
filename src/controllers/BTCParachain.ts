import { ApiPromise, WsProvider } from '@polkadot/api';
import BTCParachainInterface from '../types/BTCParachain';

const ERR_NOT_CONNECTED = new TypeError("Substrate API not connected. Make sure you can connect to a node.");

export class BTCParachain implements BTCParachainInterface {
  wsProvider: WsProvider;
  api?: ApiPromise;

  constructor() {
    this.wsProvider = new WsProvider('ws://127.0.0.1:9944');
  }

  async connect() {
    this.api = await ApiPromise.create({
      provider: this.wsProvider,
      types: {
        H256Le: 'H256',
        DOT: 'u128',
        PolkaBTC: 'u128',
      }
    });
  }

  async getTotalPolkaBTC(): Promise<string> {
    if (this.api != null) {
      const polkabtc = await this.api.query.treasury.totalIssuance();
      return polkabtc.toString();
    } else {
      throw ERR_NOT_CONNECTED;
    }
  }
}
