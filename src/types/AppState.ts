import BTCParachainInterface from './BTCParachain';

interface AppState {
  parachain: BTCParachainInterface,
  account?: string,
  vault: boolean,
  balancePolkaBTC: string,
}

export default AppState;
