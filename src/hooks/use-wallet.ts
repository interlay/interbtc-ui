import { newAccountId } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { SS58_PREFIX } from '@/config/relay-chains';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';

type UseWalletResult = {
  isAuth: boolean;
  account?: AccountId;
  accounts: KeyringPair[];
  getRelayChainAddress: (address?: string) => string | undefined;
};

const useWallet = (): UseWalletResult => {
  const { selectedAccount, accounts } = useSubstrateSecureState();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const substrate = useSubstrateSecureState();

  const account = useMemo(
    () => (selectedAccount && bridgeLoaded ? newAccountId(window.bridge.api, selectedAccount.address) : undefined),
    [bridgeLoaded, selectedAccount]
  );

  const getRelayChainAddress = useCallback(
    (address?: string) => {
      const currentAddress = address || selectedAccount?.address;

      if (!currentAddress) {
        return undefined;
      }

      const decodedAddress = substrate.keyring.decodeAddress(currentAddress);
      return substrate.keyring.encodeAddress(decodedAddress, SS58_PREFIX);
    },
    [selectedAccount?.address, substrate.keyring]
  );

  const isAuth = !!substrate.selectedAccount;

  if (!bridgeLoaded || !selectedAccount) {
    return {
      isAuth: false,
      account: undefined,
      accounts: [],
      getRelayChainAddress
    };
  }

  return {
    isAuth,
    account,
    accounts: isAuth ? accounts : [],
    getRelayChainAddress
  };
};

export { useWallet };
export type { UseWalletResult };
