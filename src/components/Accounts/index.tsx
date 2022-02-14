import * as React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import AccountSelector from './AccountSelector';
import useGetAccounts from 'utils/hooks/use-get-accounts';

const Accounts = (): JSX.Element => {
  const [selectedAccount, setSelectedAccount] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const accounts = useGetAccounts();

  React.useEffect(() => {
    if (!accounts) return;
    if (selectedAccount) return;

    // Set selected account to first item
    setSelectedAccount(accounts[0]);
  }, [
    accounts,
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
