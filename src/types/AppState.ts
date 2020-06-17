import BTCParachainInterface from './BTCParachain';

interface AppState {
  parachain: BTCParachainInterface,
  account?: string
}

export default AppState;
