// ray test touch <
import { KeyringPair } from '@polkadot/keyring/types';
import * as React from 'react';

import {
  ActionType,
  ApiStatus,
  KeyringStatus,
  SubstrateProvider,
  useSubstrateState
} from '@/substrate-lib/substrate-context';

const Main = () => {
  // TODO: create `useSubstrateSecureState` hook
  const { keyring } = useSubstrateState();
  // ray test touch <<
  if (keyring === null) {
    // ray test touch >>
    throw new Error('Something went wrong!');
  }

  // Get the list of accounts we possess the private key for
  const keyringOptions = React.useMemo(() => {
    return keyring.getPairs().map((account: KeyringPair) => ({
      id: account.address,
      name: (account.meta.name as string).toUpperCase(),
      value: account.address
    }));
  }, [keyring]);

  return (
    <ul>
      {keyringOptions.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

const SubstrateLoadingAndErrorHandlingWrapper = () => {
  const { apiStatus, apiError, keyringStatus, keyring, api } = useSubstrateState();

  switch (apiStatus) {
    case ApiStatus.Idle:
    case ApiStatus.ConnectInit:
    case ApiStatus.Connecting:
      return <>Connecting to Substrate</>;
    case ApiStatus.Ready:
      break;
    case ApiStatus.Error:
      // ray test touch <<
      if (apiError === null) {
        // ray test touch >>
        throw new Error('Something went wrong!');
      }
      return <>Error Connecting to Substrate: Connection to websocket {apiError.target.url} failed.</>;
    case ApiStatus.Disconnected:
      return <>Disconnected from Substrate</>;
    default:
      throw new Error('Invalid ApiStatus!');
  }

  switch (keyringStatus) {
    case KeyringStatus.Idle:
    case KeyringStatus.Loading:
      return <>Loading accounts (please review any extension&apos;s authorization)</>;
    case KeyringStatus.Ready:
      break;
    case KeyringStatus.Error:
      throw new Error(`${ActionType.SetKeyringError}!`);
    default:
      throw new Error('Invalid KeyringStatus!');
  }

  // ray test touch <<
  if (keyring === null || api === null) {
    // ray test touch >>
    throw new Error('Something went wrong!');
  }

  return <Main />;
};

// http://localhost:3000/?rpc=wss://api-dev-kintsugi.interlay.io/parachain
const SubstrateContextDemo = (): JSX.Element => {
  return (
    <SubstrateProvider>
      <SubstrateLoadingAndErrorHandlingWrapper />
    </SubstrateProvider>
  );
};

export default SubstrateContextDemo;
// ray test touch >
