import * as React from 'react';

import { ReactComponent as ParitySignerCompanionLogoIcon } from '@/assets/img/parity-signer-companion-logo.svg';
import { ReactComponent as PolkadotExtensionLogoIcon } from '@/assets/img/polkadot-extension-logo.svg';
import { ReactComponent as SubWalletLogoIcon } from '@/assets/img/subwallet-logo.svg';
import { ReactComponent as TalismanWalletLogoIcon } from '@/assets/img/talisman-wallet-logo.svg';
import { APP_NAME } from '@/config/relay-chains';

enum WalletSourceName {
  PolkadotExtensionLogoIcon = 'polkadot-js',
  Talisman = 'talisman',
  SubWallet = 'subwallet-js',
  ParitySignerCompanion = 'parity-signer-companion'
}

interface WalletData {
  name: string;
  LogoIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  url: string;
}

const WALLETS: { [wallet in WalletSourceName]: WalletData } = {
  [WalletSourceName.PolkadotExtensionLogoIcon]: {
    name: 'Polkadot{.js}',
    LogoIcon: PolkadotExtensionLogoIcon,
    url: 'https://polkadot.js.org/extension/'
  },
  [WalletSourceName.Talisman]: {
    name: 'Talisman',
    LogoIcon: TalismanWalletLogoIcon,
    url: 'https://talisman.xyz/'
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
  }
};

const SELECTED_ACCOUNT_LOCAL_STORAGE_KEY = `${APP_NAME}-selected-account`;

export { SELECTED_ACCOUNT_LOCAL_STORAGE_KEY, WALLETS, WalletSourceName };
