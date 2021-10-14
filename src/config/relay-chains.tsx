
import {
  Currency,
  BitcoinUnit,
  KBtc, // on Kusama
  Kusama, // on Kusama
  KBtcAmount, // on Kusama
  InterBtc, // on Polkadot
  Polkadot, // on Polkadot
  InterBtcAmount // on Polkadot
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as KintsugiLogoIcon } from 'assets/img/kintsugi-logo.svg';
import { ReactComponent as InterBTCLogoWithTextIcon } from 'assets/img/interbtc-logo-with-text.svg';
import { ReactComponent as KintsugiLogoWithTextIcon } from 'assets/img/kintsugi-logo-with-text.svg';
import { ReactComponent as DOTLogoIcon } from 'assets/img/dot-logo.svg';
import { ReactComponent as KSMLogoIcon } from 'assets/img/ksm-logo.svg';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

if (!process.env.REACT_APP_RELAY_CHAIN_NAME) {
  throw new Error('Undefined relay chain name environment variable!');
}

let APP_NAME: string;
let WRAPPED_TOKEN_SYMBOL: string;
let WRAPPED_TOKEN: Currency<BitcoinUnit>;
let COLLATERAL_TOKEN: Currency<CollateralUnit>;
let PRICES_URL: string;
let RELAY_CHAIN_NAME: string;
let COLLATERAL_TOKEN_SYMBOL: string;
let WrappedTokenLogoIcon:
  React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }>;
let WrappedTokenLogoWithTextIcon:
  React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }>;
let CollateralTokenLogoIcon:
  React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }>;

type WrappedTokenAmount =
  InterBtcAmount |
  KBtcAmount;

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
case POLKADOT: {
  APP_NAME = 'interBTC';
  WRAPPED_TOKEN_SYMBOL = 'interBTC';
  WRAPPED_TOKEN = InterBtc;
  COLLATERAL_TOKEN = Polkadot as Currency<CollateralUnit>;
  RELAY_CHAIN_NAME = 'polkadot';
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${RELAY_CHAIN_NAME}&vs_currencies=usd`;
  COLLATERAL_TOKEN_SYMBOL = 'DOT';
  WrappedTokenLogoIcon = InterBTCLogoIcon;
  WrappedTokenLogoWithTextIcon = InterBTCLogoWithTextIcon;
  CollateralTokenLogoIcon = DOTLogoIcon;
  break;
}
case KUSAMA: {
  APP_NAME = 'kBTC';
  WRAPPED_TOKEN_SYMBOL = 'kBTC';
  WRAPPED_TOKEN = KBtc;
  COLLATERAL_TOKEN = Kusama as Currency<CollateralUnit>;
  RELAY_CHAIN_NAME = 'kusama';
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${RELAY_CHAIN_NAME}&vs_currencies=usd`;
  COLLATERAL_TOKEN_SYMBOL = 'KSM';
  WrappedTokenLogoIcon = KintsugiLogoIcon;
  WrappedTokenLogoWithTextIcon = KintsugiLogoWithTextIcon;
  CollateralTokenLogoIcon = KSMLogoIcon;
  break;
}
default: {
  throw new Error('Invalid relay chain name!');
}
}

export type {
  WrappedTokenAmount
};

export {
  APP_NAME,
  WRAPPED_TOKEN_SYMBOL,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  PRICES_URL,
  RELAY_CHAIN_NAME,
  COLLATERAL_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  WrappedTokenLogoWithTextIcon,
  CollateralTokenLogoIcon
};
