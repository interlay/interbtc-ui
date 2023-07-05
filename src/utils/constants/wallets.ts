enum WalletName {
  PolkadotJS = 'polkadot-js',
  Talisman = 'talisman',
  SubWallet = 'subwallet-js',
  ParitySignerCompanion = 'parity-signer-companion'
}

type WalletData = {
  title: string;
  extensionName: WalletName;
  url: string;
};

const POLKADOTJS_WALLET = {
  title: 'Polkadot.js',
  extensionName: WalletName.PolkadotJS,
  url: 'https://polkadot.js.org/extension/'
};

const TALISMAN_WALLET = {
  title: 'Talisman',
  extensionName: WalletName.Talisman,

  url: 'https://talisman.xyz/'
};

const SUBWALLET_WALLET = {
  title: 'SubWallet',
  extensionName: WalletName.SubWallet,

  url: 'https://subwallet.app/'
};

const PARITY_SIGNER_COMPANION = {
  title: 'Parity Signer Companion',
  extensionName: WalletName.ParitySignerCompanion,
  url: 'https://github.com/paritytech/parity-signer-companion#installation'
};

const WALLETS = [POLKADOTJS_WALLET, TALISMAN_WALLET, SUBWALLET_WALLET, PARITY_SIGNER_COMPANION];

export { PARITY_SIGNER_COMPANION, POLKADOTJS_WALLET, SUBWALLET_WALLET, TALISMAN_WALLET, WalletName, WALLETS };
export type { WalletData };
