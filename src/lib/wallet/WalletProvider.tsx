import { newAccountId } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { Signer } from '@polkadot/types/types';
import React, { useCallback, useMemo } from 'react';

import { LocalStorageKey, useLocalStorage } from '@/hooks/use-local-storage';

import { WalletAccountData, WalletData } from './types';
import { useGetWallets } from './use-get-wallets';

type WalletConfig = {
  account?: WalletAccountData & { wallet: WalletData; id: AccountId };
  setAccount: (account: WalletAccountData) => void;
  disconnect: () => void;
};

const defaultContext: WalletConfig = {} as WalletConfig;

const WalletContext = React.createContext(defaultContext);

const useWallet = (): WalletConfig => React.useContext(WalletContext);

const WalletProvider: React.FC<unknown> = ({ children }) => {
  const [account, setAccount, clearAccount] = useLocalStorage(LocalStorageKey.WALLET_ACCOUNT);
  const { data: wallets } = useGetWallets();

  const wallet = account?.wallet?.extensionName
    ? wallets.available.find((wallet) => wallet.extensionName === account.wallet?.extensionName)
    : undefined;

  const handleSetAccount = useCallback(
    (account: WalletAccountData) => {
      setAccount(account);

      if (account.signer) {
        window.bridge.setAccount(account.address, account.signer as Signer);
      }
    },
    [setAccount]
  );

  const accountId = useMemo(
    () => (account && window.bridge ? newAccountId(window.bridge.api, account.address) : undefined),
    [window.bridge, account]
  );

  return (
    <WalletContext.Provider
      value={{
        account: wallet && account && accountId && { ...account, id: accountId, wallet },
        disconnect: clearAccount,
        setAccount: handleSetAccount
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export { useWallet, WalletContext, WalletProvider };
