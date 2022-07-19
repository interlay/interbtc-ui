// ray test touch <<
import * as React from 'react';
import { useSelector } from 'react-redux';
import { AccountId } from '@polkadot/types/interfaces';
import { newAccountId } from '@interlay/interbtc-api';

import { StoreType } from 'common/types/util.types';

const useAccountId = (accountAddress?: string): AccountId | undefined => {
  const { bridgeLoaded, address } = useSelector((state: StoreType) => state.general);

  return React.useMemo(() => {
    // eslint-disable-next-line max-len
    // TODO: should correct loading procedure according to https://kentcdodds.com/blog/application-state-management-with-react
    if (!bridgeLoaded) return;
    if (!address) return;

    return newAccountId(window.bridge.api, accountAddress || address);
  }, [bridgeLoaded, accountAddress, address]);
};

export default useAccountId;
// ray test touch >>
