import * as React from 'react';

import { ReactComponent as NovaWalletLogoIcon } from '@/assets/img/nova-logo.svg';
import { ReactComponent as ParitySignerCompanionLogoIcon } from '@/assets/img/parity-signer-companion-logo.svg';
import { ReactComponent as PolkadotExtensionLogoIcon } from '@/assets/img/polkadot-extension-logo.svg';
import { ReactComponent as SubWalletLogoIcon } from '@/assets/img/subwallet-logo.svg';
import { ReactComponent as TalismanWalletLogoIcon } from '@/assets/img/talisman-wallet-logo.svg';
import { APP_NAME } from '@/config/relay-chains';

enum WalletSourceName {
  Nova = 'nova',
  ParitySignerCompanion = 'parity-signer-companion',
  PolkadotExtensionLogoIcon = 'polkadot-js',
  SubWallet = 'subwallet-js',
  Talisman = 'talisman'
}

interface WalletData {
  name: string;
  LogoIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  url: string;
}

const WALLETS: { [wallet in WalletSourceName]: WalletData } = {
  [WalletSourceName.Talisman]: {
    name: 'Talisman',
    LogoIcon: TalismanWalletLogoIcon,
    url: 'https://talisman.xyz/'
  },
  [WalletSourceName.Nova]: {
    name: 'Nova',
    LogoIcon: NovaWalletLogoIcon,
    url: 'https://novawallet.io/'
  },
  [WalletSourceName.SubWallet]: {
    name: 'SubWallet',
    LogoIcon: SubWalletLogoIcon,
    url: 'https://subwallet.app/'
  },
  [WalletSourceName.ParitySignerCompanion]: {
    name: 'Parity Signer Companion',
    LogoIcon: ParitySignerCompanionLogoIcon,
    url: 'https://github.com/paritytech/parity-signer-companion#installation'
  },
  [WalletSourceName.PolkadotExtensionLogoIcon]: {
    name: 'Polkadot{.js} (for developers)',
    LogoIcon: PolkadotExtensionLogoIcon,
    url: 'https://polkadot.js.org/extension/'
  }
};

const SELECTED_ACCOUNT_LOCAL_STORAGE_KEY = `${APP_NAME}-selected-account`;

export { SELECTED_ACCOUNT_LOCAL_STORAGE_KEY, WALLETS, WalletSourceName };
