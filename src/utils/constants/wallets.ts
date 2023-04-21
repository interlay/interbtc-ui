enum WalletName {
  PolkadotJS = 'polkadot-js',
  Talisman = 'talisman',
  SubWallet = 'subwallet-js'
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

const WALLETS = [POLKADOTJS_WALLET, TALISMAN_WALLET, SUBWALLET_WALLET];

export { WalletName, WALLETS };
export type { WalletData };
