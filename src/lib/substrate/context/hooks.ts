import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/ui-keyring/Keyring';
import * as React from 'react';

import { SubstrateStateContext } from './provider';
import { SecureState, State, SubstrateStateContextInterface } from './types';

const useSubstrate = (): SubstrateStateContextInterface => {
  const context = React.useContext(SubstrateStateContext);
  if (context === undefined) {
    throw new Error('useSubstrate must be used within a SubstrateProvider!');
  }
  return context;
};

const useSubstrateState = (): State => useSubstrate().state; // TODO: it could be redundant in favor of useSubstrate

const useSubstrateSecureState = (): SecureState => {
  const state = useSubstrateState();

  return {
    ...state,
    api: state.api as ApiPromise,
    keyring: state.keyring as Keyring
  };
};

export { useSubstrate, useSubstrateSecureState, useSubstrateState };
