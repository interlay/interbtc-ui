import { CollateralUnit, CurrencyIdLiteral, GovernanceUnit, VoteUnit } from '@interlay/interbtc-api';
import {
  BitcoinUnit,
  Currency,
  InterBtc, // on Polkadot
  InterBtcAmount, // on Polkadot
  Interlay, // On Polkadot
  KBtc, // on Kusama
  KBtcAmount, // on Kusama
  Kintsugi, // On Kusama
  Kusama, // on Kusama
  MonetaryAmount,
  Polkadot // on Polkadot
} from '@interlay/monetary-js';

import { ReactComponent as DOTLogoIcon } from '@/assets/img/dot-logo.svg';
import { ReactComponent as InterBTCLogoIcon } from '@/assets/img/interbtc-logo.svg';
import { ReactComponent as InterlayLogoIcon } from '@/assets/img/interlay-logo.svg';
import { ReactComponent as InterlayLogoWithTextIcon } from '@/assets/img/interlay-logo-with-text.svg';
import { ReactComponent as KBTCLogoIcon } from '@/assets/img/kbtc-logo-reversed.svg';
import { ReactComponent as KintsugiLogoIcon } from '@/assets/img/kintsugi-logo-reversed.svg';
import { ReactComponent as KintsugiLogoWithTextIcon } from '@/assets/img/kintsugi-logo-with-text.svg';
import { ReactComponent as KusamaLogoIcon } from '@/assets/img/kusama-logo.svg';
import {
  INTERLAY_CROWDLOAN_LINK,
  INTERLAY_EARN_LINK,
  INTERLAY_GOVERNANCE_LINK,
  INTERLAY_SUBSCAN_LINK,
  INTERLAY_TERMS_AND_CONDITIONS_LINK,
  KINTSUGI_CROWDLOAN_LINK,
  KINTSUGI_EARN_LINK,
  KINTSUGI_GOVERNANCE_LINK,
  KINTSUGI_SUBSCAN_LINK,
  KINTSUGI_TERMS_AND_CONDITIONS_LINK
} from '@/config/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

if (!process.env.REACT_APP_RELAY_CHAIN_NAME) {
  throw new Error('Undefined relay chain name environment variable!');
}

type WrappedToken = Currency<BitcoinUnit>;
type CollateralToken = Currency<CollateralUnit>;
type GovernanceToken = Currency<GovernanceUnit>;
type VoteGovernanceToken = Currency<VoteUnit>;
type GovernanceTokenMonetaryAmount = MonetaryAmount<GovernanceToken, GovernanceUnit>;
type CollateralTokenMonetaryAmount = MonetaryAmount<CollateralToken, CollateralUnit>;
type VoteGovernanceTokenMonetaryAmount = MonetaryAmount<VoteGovernanceToken, VoteUnit>;

let APP_NAME: string;
let CROWDLOAN_LINK: string;
let TERMS_AND_CONDITIONS_LINK: string;
let EARN_LINK: string;
let GOVERNANCE_LINK: string;
let SUBSCAN_LINK: string;
let WRAPPED_TOKEN: WrappedToken;
let RELAY_CHAIN_NATIVE_TOKEN: CollateralToken;
let GOVERNANCE_TOKEN: GovernanceToken;
let VOTE_GOVERNANCE_TOKEN: VoteGovernanceToken;
let RELAY_CHAIN_NAME: string;
let BRIDGE_PARACHAIN_NAME: string;
let WRAPPED_TOKEN_SYMBOL: CurrencyIdLiteral;
let GOVERNANCE_TOKEN_SYMBOL: CurrencyIdLiteral;
let RELAY_CHAIN_NATIVE_TOKEN_SYMBOL: CurrencyIdLiteral;
let VOTE_GOVERNANCE_TOKEN_SYMBOL: string;
let RelayChainLogoIcon: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;
let BridgeParachainLogoIcon: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;
let WrappedTokenLogoIcon: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;
let GovernanceTokenLogoWithTextIcon: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;
let RelayChainNativeTokenLogoIcon: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;
let GovernanceTokenLogoIcon: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;
let PUBLIC_ASSETS_FOLDER_NAME: string;
let APP_DOMAIN: string;
let OPEN_GRAPH_IMAGE_FILE_NAME: string;
let STAKE_LOCK_TIME: {
  // Weeks
  MIN: number;
  MAX: number;
};

type WrappedTokenAmount = InterBtcAmount | KBtcAmount;

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
  // Interlay
  case POLKADOT: {
    APP_NAME = 'Interlay';
    TERMS_AND_CONDITIONS_LINK = INTERLAY_TERMS_AND_CONDITIONS_LINK;
    EARN_LINK = INTERLAY_EARN_LINK;
    GOVERNANCE_LINK = INTERLAY_GOVERNANCE_LINK;
    SUBSCAN_LINK = INTERLAY_SUBSCAN_LINK;
    WRAPPED_TOKEN = InterBtc;
    RELAY_CHAIN_NATIVE_TOKEN = Polkadot as Currency<CollateralUnit>;
    GOVERNANCE_TOKEN = Interlay as GovernanceToken;
    VOTE_GOVERNANCE_TOKEN = Interlay as VoteGovernanceToken;
    WRAPPED_TOKEN_SYMBOL = CurrencyIdLiteral.INTERBTC;
    RELAY_CHAIN_NATIVE_TOKEN_SYMBOL = CurrencyIdLiteral.DOT;
    GOVERNANCE_TOKEN_SYMBOL = CurrencyIdLiteral.INTR;
    VOTE_GOVERNANCE_TOKEN_SYMBOL = 'vINTR';
    RELAY_CHAIN_NAME = 'polkadot';
    BRIDGE_PARACHAIN_NAME = 'interlay';
    RelayChainLogoIcon = DOTLogoIcon;
    BridgeParachainLogoIcon = InterlayLogoIcon;
    WrappedTokenLogoIcon = InterBTCLogoIcon;
    GovernanceTokenLogoWithTextIcon = InterlayLogoWithTextIcon;
    RelayChainNativeTokenLogoIcon = DOTLogoIcon;
    GovernanceTokenLogoIcon = InterlayLogoIcon;
    PUBLIC_ASSETS_FOLDER_NAME = 'interlay';
    APP_DOMAIN = 'https://bridge.interlay.io';
    CROWDLOAN_LINK = INTERLAY_CROWDLOAN_LINK;
    OPEN_GRAPH_IMAGE_FILE_NAME = 'interlay-meta-image.jpg';
    STAKE_LOCK_TIME = {
      MIN: 1,
      MAX: 192
    };
    break;
  }
  // Kintsugi
  case KUSAMA: {
    APP_NAME = 'Kintsugi';
    TERMS_AND_CONDITIONS_LINK = KINTSUGI_TERMS_AND_CONDITIONS_LINK;
    EARN_LINK = KINTSUGI_EARN_LINK;
    GOVERNANCE_LINK = KINTSUGI_GOVERNANCE_LINK;
    SUBSCAN_LINK = KINTSUGI_SUBSCAN_LINK;
    WRAPPED_TOKEN = KBtc;
    RELAY_CHAIN_NATIVE_TOKEN = Kusama as Currency<CollateralUnit>;
    GOVERNANCE_TOKEN = Kintsugi as GovernanceToken;
    VOTE_GOVERNANCE_TOKEN = Kintsugi as VoteGovernanceToken;
    WRAPPED_TOKEN_SYMBOL = CurrencyIdLiteral.KBTC;
    RELAY_CHAIN_NATIVE_TOKEN_SYMBOL = CurrencyIdLiteral.KSM;
    GOVERNANCE_TOKEN_SYMBOL = CurrencyIdLiteral.KINT;
    VOTE_GOVERNANCE_TOKEN_SYMBOL = 'vKINT';
    RELAY_CHAIN_NAME = 'kusama';
    BRIDGE_PARACHAIN_NAME = 'kintsugi';
    RelayChainLogoIcon = KusamaLogoIcon;
    BridgeParachainLogoIcon = KintsugiLogoIcon;
    WrappedTokenLogoIcon = KBTCLogoIcon;
    GovernanceTokenLogoWithTextIcon = KintsugiLogoWithTextIcon;
    RelayChainNativeTokenLogoIcon = KusamaLogoIcon;
    GovernanceTokenLogoIcon = KintsugiLogoIcon;
    PUBLIC_ASSETS_FOLDER_NAME = 'kintsugi';
    APP_DOMAIN = ''; // TODO: should add the Kintsugi app domain once it's set up
    CROWDLOAN_LINK = KINTSUGI_CROWDLOAN_LINK;
    OPEN_GRAPH_IMAGE_FILE_NAME = 'kintsugi-meta-image.jpg';
    STAKE_LOCK_TIME = {
      MIN: 1,
      MAX: 96
    };
    break;
  }
  default: {
    throw new Error('Invalid relay chain name!');
  }
}

export type {
  CollateralToken,
  CollateralTokenMonetaryAmount,
  GovernanceToken,
  GovernanceTokenMonetaryAmount,
  VoteGovernanceTokenMonetaryAmount,
  WrappedToken,
  WrappedTokenAmount
};

export {
  APP_DOMAIN,
  APP_NAME,
  BRIDGE_PARACHAIN_NAME,
  BridgeParachainLogoIcon,
  CROWDLOAN_LINK,
  EARN_LINK,
  GOVERNANCE_LINK,
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenLogoIcon,
  GovernanceTokenLogoWithTextIcon,
  OPEN_GRAPH_IMAGE_FILE_NAME,
  PUBLIC_ASSETS_FOLDER_NAME,
  RELAY_CHAIN_NAME,
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  RelayChainLogoIcon,
  RelayChainNativeTokenLogoIcon,
  STAKE_LOCK_TIME,
  SUBSCAN_LINK,
  TERMS_AND_CONDITIONS_LINK,
  VOTE_GOVERNANCE_TOKEN,
  VOTE_GOVERNANCE_TOKEN_SYMBOL,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon
};
