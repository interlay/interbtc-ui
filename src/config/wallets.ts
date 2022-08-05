import * as React from 'react';

import { ReactComponent as PolkadotExtensionLogoIcon } from '@/assets/img/polkadot-extension-logo.svg';
import { ReactComponent as SubWalletLogoIcon } from '@/assets/img/subwallet-logo.svg';
import { ReactComponent as TalismanWalletLogoIcon } from '@/assets/img/talisman-wallet-logo.svg';

enum WalletSourceName {
  PolkadotExtensionLogoIcon = 'polkadot-js',
  Talisman = 'talisman',
  SubWallet = 'subwallet-js'
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
  }
};

export { WALLETS, WalletSourceName };
