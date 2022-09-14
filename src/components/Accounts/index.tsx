import { KeyringPair } from '@polkadot/keyring/types';
import * as React from 'react';

import { useSubstrateSecureState } from '@/substrate-lib/substrate-context';
import useGetAccounts from '@/utils/hooks/api/use-get-accounts';

import AccountSelector from './AccountSelector';

interface Props {
  callbackFunction?: (account: KeyringPair) => void;
  label: string;
}

const Accounts = ({ callbackFunction, label }: Props): JSX.Element => {
  const { selectedAccount: currentAccount } = useSubstrateSecureState();
  const accounts = useGetAccounts();

  const [selectedAccount, setSelectedAccount] = React.useState<KeyringPair | undefined>(undefined);

  React.useEffect(() => {
    if (!currentAccount) return;

    if (!selectedAccount) {
      setSelectedAccount(currentAccount);
    }

    if (callbackFunction && selectedAccount) {
      callbackFunction(selectedAccount);
    }
  }, [callbackFunction, currentAccount, selectedAccount]);

  return (
    <div>
      {accounts && selectedAccount ? (
        <AccountSelector
          label={label}
          accounts={accounts}
          selectedAccount={selectedAccount}
          onChange={setSelectedAccount}
        />
      ) : null}
    </div>
  );
};

export default Accounts;
