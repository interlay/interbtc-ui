import BTCParachainInterface from './BTCParachain';

interface AppState {
  parachain: BTCParachainInterface,
  account?: string,
  balancePolkaBTC: string
}

export default AppState;
