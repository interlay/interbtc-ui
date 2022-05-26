import * as React from 'react';
import { ReactComponent as PolkadotExtensionLogoIcon } from 'assets/img/polkadot-extension-logo.svg';
import { ReactComponent as TalismanWalletLogoIcon } from 'assets/img/talisman-wallet-logo.svg';
import { ReactComponent as SubWalletLogoIcon } from 'assets/img/subwallet-logo.svg';

enum WalletSourceName {
  PolkadotExtensionLogoIcon = 'polkadot-js',
  Talisman = 'talisman',
  SubWallet = 'subwallet-js'
}

interface WalletData {
  name: string;
  LogoIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  URL: string;
}

const WALLETS: {[wallet in WalletSourceName]: WalletData} =
  {
    [WalletSourceName.PolkadotExtensionLogoIcon]: {
      name: 'Polkadot{.js}',
      LogoIcon: PolkadotExtensionLogoIcon,
      URL: 'https://polkadot.js.org/extension/'
    },
    [WalletSourceName.Talisman]: {
      name: 'Talisman',
      LogoIcon: TalismanWalletLogoIcon,
      URL: 'https://talisman.xyz/'
    },
    [WalletSourceName.SubWallet]: {
      name: 'SubWallet',
      LogoIcon: SubWalletLogoIcon,
      URL: 'https://subwallet.app/'
    }
  };

export {
  WalletSourceName,
  WALLETS
};
