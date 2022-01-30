import {
  Currency,
  BitcoinUnit,
  KBtc, // on Kusama
  Kusama, // on Kusama
  KBtcAmount, // on Kusama
  Kintsugi, // On Kusama
  InterBtc, // on Polkadot
  Polkadot, // on Polkadot
  InterBtcAmount, // on Polkadot
  Interlay // On Polkadot
} from '@interlay/monetary-js';
import {
  CollateralUnit,
  GovernanceUnit
} from '@interlay/interbtc-api';

import {
  INTERLAY_TERMS_AND_CONDITIONS_LINK,
  KINTSUGI_TERMS_AND_CONDITIONS_LINK
} from 'config/links';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as KintsugiLogoIcon } from 'assets/img/kintsugi-logo-reversed.svg';
import { ReactComponent as KBTCLogoIcon } from 'assets/img/kbtc-logo-reversed.svg';
import { ReactComponent as InterBTCLogoWithTextIcon } from 'assets/img/interbtc-logo-with-text.svg';
import { ReactComponent as KintsugiLogoWithTextIcon } from 'assets/img/kintsugi-logo-with-text.svg';
import { ReactComponent as DOTLogoIcon } from 'assets/img/dot-logo.svg';
import { ReactComponent as KSMLogoIcon } from 'assets/img/ksm-logo.svg';
import { ReactComponent as InterlayLogoIcon } from 'assets/img/interlay-logo.svg';

if (!process.env.REACT_APP_RELAY_CHAIN_NAME) {
  throw new Error('Undefined relay chain name environment variable!');
}

type WrappedToken = Currency<BitcoinUnit>;
type CollateralToken = Currency<CollateralUnit>;
type GovernanceToken = Currency<GovernanceUnit>;

let APP_NAME: string;
let TERMS_AND_CONDITIONS_LINK: string;
let WRAPPED_TOKEN_SYMBOL: string;
let WRAPPED_TOKEN: WrappedToken;
let COLLATERAL_TOKEN: CollateralToken;
let GOVERNANCE_TOKEN: GovernanceToken;
let PRICES_URL: string;
let RELAY_CHAIN_NAME: string;
let BRIDGE_PARACHAIN_NAME: string;
let COLLATERAL_TOKEN_SYMBOL: string;
let GOVERNANCE_TOKEN_SYMBOL: string;
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
let GovernanceTokenLogoIcon:
  React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }>;
let PUBLIC_ASSETS_FOLDER_NAME: string;
let APP_DOMAIN: string;
let OPEN_GRAPH_IMAGE_FILE_NAME: string;

type WrappedTokenAmount =
  InterBtcAmount |
  KBtcAmount;

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
// Interlay
case POLKADOT: {
  APP_NAME = 'Interlay';
  TERMS_AND_CONDITIONS_LINK = INTERLAY_TERMS_AND_CONDITIONS_LINK;
  WRAPPED_TOKEN = InterBtc;
  COLLATERAL_TOKEN = Polkadot as Currency<CollateralUnit>;
  // TODO: Add GovernanceUnit type to lib following upgrade i.e. Currency<GovernanceUnit>
  GOVERNANCE_TOKEN = Interlay as Currency<GovernanceUnit>;
  WRAPPED_TOKEN_SYMBOL = 'interBTC';
  COLLATERAL_TOKEN_SYMBOL = 'DOT';
  GOVERNANCE_TOKEN_SYMBOL = 'INTR';
  RELAY_CHAIN_NAME = 'polkadot';
  BRIDGE_PARACHAIN_NAME = 'interlay';
  // eslint-disable-next-line max-len
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${RELAY_CHAIN_NAME},${BRIDGE_PARACHAIN_NAME}&vs_currencies=usd`;
  WrappedTokenLogoIcon = InterBTCLogoIcon;
  WrappedTokenLogoWithTextIcon = InterBTCLogoWithTextIcon;
  CollateralTokenLogoIcon = DOTLogoIcon;
  GovernanceTokenLogoIcon = InterlayLogoIcon;
  PUBLIC_ASSETS_FOLDER_NAME = 'interlay';
  APP_DOMAIN = 'https://bridge.interlay.io';
  OPEN_GRAPH_IMAGE_FILE_NAME = 'interlay-meta-image.jpg';
  break;
}
// Kintsugi
case KUSAMA: {
  APP_NAME = 'Kintsugi';
  TERMS_AND_CONDITIONS_LINK = KINTSUGI_TERMS_AND_CONDITIONS_LINK;
  WRAPPED_TOKEN = KBtc;
  COLLATERAL_TOKEN = Kusama as Currency<CollateralUnit>;
  GOVERNANCE_TOKEN = Kintsugi as Currency<GovernanceUnit>;
  WRAPPED_TOKEN_SYMBOL = 'kBTC';
  COLLATERAL_TOKEN_SYMBOL = 'KSM';
  GOVERNANCE_TOKEN_SYMBOL = 'KINT';
  RELAY_CHAIN_NAME = 'kusama';
  BRIDGE_PARACHAIN_NAME = 'kintsugi';
  // eslint-disable-next-line max-len
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${RELAY_CHAIN_NAME},${BRIDGE_PARACHAIN_NAME}&vs_currencies=usd`;
  WrappedTokenLogoIcon = KintsugiLogoIcon;
  WrappedTokenLogoWithTextIcon = KintsugiLogoWithTextIcon;
  CollateralTokenLogoIcon = KSMLogoIcon;
  GovernanceTokenLogoIcon = KBTCLogoIcon;
  PUBLIC_ASSETS_FOLDER_NAME = 'kintsugi';
  APP_DOMAIN = ''; // TODO: should add the Kintsugi app domain once it's set up
  OPEN_GRAPH_IMAGE_FILE_NAME = 'kintsugi-meta-image.jpg';
  break;
}
default: {
  throw new Error('Invalid relay chain name!');
}
}

export type {
  CollateralToken,
  WrappedToken,
  GovernanceToken,
  WrappedTokenAmount
};

export {
  APP_NAME,
  TERMS_AND_CONDITIONS_LINK,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  GOVERNANCE_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL,
  GOVERNANCE_TOKEN_SYMBOL,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME,
  PRICES_URL,
  WrappedTokenLogoIcon,
  WrappedTokenLogoWithTextIcon,
  CollateralTokenLogoIcon,
  GovernanceTokenLogoIcon,
  PUBLIC_ASSETS_FOLDER_NAME,
  APP_DOMAIN,
  OPEN_GRAPH_IMAGE_FILE_NAME
};
