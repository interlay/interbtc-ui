import * as React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import AccountSelector from './AccountSelector';
import useGetAccounts from 'utils/hooks/use-get-accounts';

interface Props {
  callbackFunction?: (account: InjectedAccountWithMeta) => void;
}

const Accounts = ({ callbackFunction }: Props): JSX.Element => {
  const [selectedAccount, setSelectedAccount] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const accounts = useGetAccounts();

  React.useEffect(() => {
    if (!accounts) return;

    if (!selectedAccount) {
    // Set selected account to first item
      setSelectedAccount(accounts[0]);
    }

    if (callbackFunction && selectedAccount) {
      callbackFunction(selectedAccount);
    }
  }, [
    accounts,
    callbackFunction,
    selectedAccount
  ]);

  return (
    <>
      {accounts && selectedAccount ? (
        <AccountSelector
          accounts={accounts}
          selectedAccount={selectedAccount}
          onChange={setSelectedAccount} />
      ) : null}
    </>
  );
};

export default Accounts;
