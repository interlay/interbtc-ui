import * as React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import AccountSelector from './AccountSelector';
import useGetAccounts from 'utils/hooks/api/use-get-accounts';
import { useSelector } from 'react-redux';
import { StoreType } from 'common/types/util.types';

interface Props {
  callbackFunction?: (account: InjectedAccountWithMeta) => void;
  label: string;
}

const Accounts = ({ callbackFunction, label }: Props): JSX.Element => {
  const { address } = useSelector((state: StoreType) => state.general);
  const [selectedAccount, setSelectedAccount] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const accounts = useGetAccounts();

  React.useEffect(() => {
    if (!accounts || !address) return;

    if (!selectedAccount) {
      const currentAccount = accounts.find((account) => account.address === address);
      setSelectedAccount(currentAccount);
    }

    if (callbackFunction && selectedAccount) {
      callbackFunction(selectedAccount);
    }
  }, [accounts, callbackFunction, address, selectedAccount]);

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
