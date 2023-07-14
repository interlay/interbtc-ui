enum WalletName {
  Talisman = 'talisman',
  Nova = 'nova',
  SubWallet = 'subwallet-js',
  ParitySignerCompanion = 'parity-signer-companion',
  PolkadotJS = 'polkadot-js'
}

type WalletData = {
  title: string;
  extensionName: WalletName;
  url: string;
};

const NOVA_WALLET = {
  title: 'Nova',
  extensionName: WalletName.Nova,
  url: 'https://novawallet.io/'
};

const PARITY_SIGNER_COMPANION = {
  title: 'Parity Signer Companion',
  extensionName: WalletName.ParitySignerCompanion,
  url: 'https://github.com/paritytech/parity-signer-companion#installation'
};

const POLKADOTJS_WALLET = {
  title: 'Polkadot.js (for developers)',
  extensionName: WalletName.PolkadotJS,
  url: 'https://polkadot.js.org/extension/'
};

const SUBWALLET_WALLET = {
  title: 'SubWallet',
  extensionName: WalletName.SubWallet,
  url: 'https://subwallet.app/'
};

const TALISMAN_WALLET = {
  title: 'Talisman',
  extensionName: WalletName.Talisman,
  url: 'https://talisman.xyz/'
};

const WALLETS = [TALISMAN_WALLET, NOVA_WALLET, SUBWALLET_WALLET, PARITY_SIGNER_COMPANION, POLKADOTJS_WALLET];

export {
  NOVA_WALLET,
  PARITY_SIGNER_COMPANION,
  POLKADOTJS_WALLET,
  SUBWALLET_WALLET,
  TALISMAN_WALLET,
  WalletName,
  WALLETS
};
export type { WalletData };
