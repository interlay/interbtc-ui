import * as React from 'react';
import { ReactComponent as PolkadotExtensionLogoIcon } from 'assets/img/polkadot-extension-logo.svg';
import { ReactComponent as TalismanWalletLogoIcon } from 'assets/img/talisman-wallet-logo.svg';
import { ReactComponent as SubWalletLogoIcon } from 'assets/img/subwallet-logo.svg';

enum InjectedWalletSourceName {
    POLKADOT_EXTENSION = 'polkadot-js',
    TALISMAN = 'talisman',
    SUBWALLET = 'subwallet-js'
}

interface WalletData {
    name: string;
    LogoIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    URL: string;
}

const WALLETS_DATA: {[wallet in InjectedWalletSourceName]: WalletData} =
    {
      [InjectedWalletSourceName.POLKADOT_EXTENSION]: {
        name: 'Polkadot.js',
        LogoIcon: PolkadotExtensionLogoIcon,
        URL: 'https://polkadot.js.org/extension/'
      },
      [InjectedWalletSourceName.TALISMAN]: {
        name: 'Talisman',
        LogoIcon: TalismanWalletLogoIcon,
        URL: 'https://talisman.xyz/'
      },
      [InjectedWalletSourceName.SUBWALLET]: {
        name: 'SubWallet',
        LogoIcon: SubWalletLogoIcon,
        URL: 'https://subwallet.app/'
      }
    };

export {
  InjectedWalletSourceName,
  WALLETS_DATA
};
