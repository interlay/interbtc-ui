// ray test touch <
import { KeyringPair } from '@polkadot/keyring/types';
import * as React from 'react';

import DeveloperConsole from '@/substrate-lib/components/DeveloperConsole';
import {
  ActionType,
  ApiStatus,
  KeyringStatus,
  SubstrateProvider,
  useSubstrateSecureState,
  useSubstrateState
} from '@/substrate-lib/substrate-context';

const Main = () => {
  const { keyring } = useSubstrateSecureState();

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

interface SubstrateLoadingAndErrorHandlingWrapperProps {
  children: React.ReactNode;
}

const SubstrateLoadingAndErrorHandlingWrapper = ({ children }: SubstrateLoadingAndErrorHandlingWrapperProps) => {
  const { apiStatus, apiError, keyringStatus, keyring, api } = useSubstrateState();

  switch (apiStatus) {
    case ApiStatus.Idle:
    case ApiStatus.ConnectInit:
    case ApiStatus.Connecting:
      return <>Connecting to Substrate</>;
    case ApiStatus.Ready:
      break;
    case ApiStatus.Error:
      if (apiError === undefined) {
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

  if (keyring === undefined || api === undefined) {
    throw new Error('Something went wrong!');
  }

  return <>{children}</>;
};

// http://localhost:3000/?rpc=wss://api-dev-kintsugi.interlay.io/parachain
const SubstrateContextDemo = (): JSX.Element => {
  return (
    <SubstrateProvider>
      <SubstrateLoadingAndErrorHandlingWrapper>
        <Main />
      </SubstrateLoadingAndErrorHandlingWrapper>
      <DeveloperConsole />
    </SubstrateProvider>
  );
};

export default SubstrateContextDemo;
// ray test touch >
