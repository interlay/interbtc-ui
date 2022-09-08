// ray test touch <
import { KeyringPair } from '@polkadot/keyring/types';
import * as React from 'react';

import DeveloperConsole from '@/substrate-lib/components/DeveloperConsole';
import SubstrateLoadingAndErrorHandlingWrapper from '@/substrate-lib/components/SubstrateLoadingAndErrorHandlingWrapper';
import { SubstrateProvider, useSubstrateSecureState } from '@/substrate-lib/substrate-context';

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
