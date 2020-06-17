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
        PolkaBTC: 'Balance',
        BTCBalance: 'u128',
      }
    });
    console.log(this.api.query);
  }

  async getTotalPolkaBTC(): Promise<string> {
    if (this.api != null) {
      const polkabtc = await this.api.query.polkaBtc.totalIssuance();
      console.log(polkabtc);
      return polkabtc.toString();
    } else {
      throw ERR_NOT_CONNECTED;
    }
  }

  async getTotalLockedDOT(): Promise<string> {
    if (this.api != null) {
      const dot = await this.api.query.collateral.totalCollateral();
      return dot.toString();
    } else {
      throw ERR_NOT_CONNECTED;
    }
  }

  async getTotalDOT(): Promise<string> {
    if (this.api != null) {
      const dot = await this.api.query.dot.totalIssuance();
      return dot.toString();
    } else {
      throw ERR_NOT_CONNECTED;
    }
  }

  async getBalancePolkaBTC(address: string): Promise<string> {
    if (this.api != null) {
      const { data: balance } = await this.api.query.system.account(address);
      return balance.free.toString();
    } else {
      throw ERR_NOT_CONNECTED;
    }
  }

  async getBalanceDOT(address: string): Promise<string> {
    if (this.api != null) {
      const { data: balance } = await this.api.query.system.account(address);
      return balance.free.toString();
    } else {
      throw ERR_NOT_CONNECTED;
    }
  }
}
