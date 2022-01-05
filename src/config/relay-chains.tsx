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
  CurrencyUnit
} from '@interlay/interbtc-api';

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

let APP_NAME: string;
let WRAPPED_TOKEN_SYMBOL: string;
let WRAPPED_TOKEN: Currency<BitcoinUnit>;
let COLLATERAL_TOKEN: Currency<CollateralUnit>;
let GOVERNANCE_TOKEN: Currency<CurrencyUnit>;
let PRICES_URL: string;
let RELAY_CHAIN_NAME: string;
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

type WrappedTokenAmount =
  InterBtcAmount |
  KBtcAmount;

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
// Interlay
case POLKADOT: {
  APP_NAME = 'interBTC';
  WRAPPED_TOKEN = InterBtc;
  COLLATERAL_TOKEN = Polkadot as Currency<CollateralUnit>;
  // TODO: Add GovernanceUnit type to lib following upgrade i.e. Currency<GovernanceUnit>
  GOVERNANCE_TOKEN = Interlay as Currency<CurrencyUnit>;
  WRAPPED_TOKEN_SYMBOL = 'interBTC';
  COLLATERAL_TOKEN_SYMBOL = 'DOT';
  GOVERNANCE_TOKEN_SYMBOL = 'INTR';
  RELAY_CHAIN_NAME = 'polkadot';
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${RELAY_CHAIN_NAME}&vs_currencies=usd`;
  WrappedTokenLogoIcon = InterBTCLogoIcon;
  WrappedTokenLogoWithTextIcon = InterBTCLogoWithTextIcon;
  CollateralTokenLogoIcon = DOTLogoIcon;
  GovernanceTokenLogoIcon = InterlayLogoIcon;
  break;
}
// Kintsugi
case KUSAMA: {
  APP_NAME = 'kBTC';
  WRAPPED_TOKEN = KBtc;
  COLLATERAL_TOKEN = Kusama as Currency<CollateralUnit>;
  GOVERNANCE_TOKEN = Kintsugi as Currency<CurrencyUnit>;
  WRAPPED_TOKEN_SYMBOL = 'kBTC';
  COLLATERAL_TOKEN_SYMBOL = 'KSM';
  GOVERNANCE_TOKEN_SYMBOL = 'KINT';
  RELAY_CHAIN_NAME = 'kusama';
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${RELAY_CHAIN_NAME}&vs_currencies=usd`;
  WrappedTokenLogoIcon = KintsugiLogoIcon;
  WrappedTokenLogoWithTextIcon = KintsugiLogoWithTextIcon;
  CollateralTokenLogoIcon = KSMLogoIcon;
  GovernanceTokenLogoIcon = KBTCLogoIcon;
  break;
}
default: {
  throw new Error('Invalid relay chain name!');
}
}

export type { WrappedTokenAmount };

export {
  APP_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  GOVERNANCE_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL,
  GOVERNANCE_TOKEN_SYMBOL,
  RELAY_CHAIN_NAME,
  PRICES_URL,
  WrappedTokenLogoIcon,
  WrappedTokenLogoWithTextIcon,
  CollateralTokenLogoIcon,
  GovernanceTokenLogoIcon
};
