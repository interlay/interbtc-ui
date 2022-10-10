import './@interlay/interbtc-api';
import './@polkadot/api';
import './@polkadot/extension-dapp';
import './intersectionObserver';
import './fetch';

if (!process.env?.REACT_APP_RELAY_CHAIN_NAME) {
  throw new Error('Please make sure you have created .env.test file with the necessary env variables');
}
