import { newAccountId } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { useSubstrateSecureState } from '@/lib/substrate/substrate-context';

const useAccountId = (accountAddress?: string): AccountId | undefined => {
  const { selectedAccount } = useSubstrateSecureState();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  return React.useMemo(() => {
    // eslint-disable-next-line max-len
    // TODO: should correct loading procedure according to https://kentcdodds.com/blog/application-state-management-with-react
    if (!bridgeLoaded) return;
    if (!selectedAccount) return;

    return newAccountId(window.bridge.api, accountAddress || selectedAccount.address);
  }, [bridgeLoaded, accountAddress, selectedAccount]);
};

export default useAccountId;
