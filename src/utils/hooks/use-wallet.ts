import { newAccountId } from '@interlay/interbtc-api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountId } from '@polkadot/types/interfaces';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { useSubstrateSecureState } from '@/lib/substrate';

type UseWalletResult = {
  isAuth: boolean;
  account?: AccountId;
  accounts: InjectedAccountWithMeta[];
};

const useWallet = (): UseWalletResult => {
  const { selectedAccount, accounts } = useSubstrateSecureState();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const substrate = useSubstrateSecureState();

  const account = useMemo(
    () => (selectedAccount && bridgeLoaded ? newAccountId(window.bridge.api, selectedAccount.address) : undefined),
    [bridgeLoaded, selectedAccount]
  );

  const isAuth = !!substrate.selectedAccount;

  if (!bridgeLoaded || !selectedAccount) {
    return {
      isAuth: false,
      account: undefined,
      accounts: []
    };
  }

  return {
    isAuth,
    account,
    accounts: isAuth ? accounts : []
  };
};

export { useWallet };
export type { UseWalletResult };
