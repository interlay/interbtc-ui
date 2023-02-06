import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { forwardRef, useState } from 'react';

import { KeyringPair } from '@/lib/substrate';

import { AccountInputLabel } from './AccountInputLabel';
import { AccountSelect } from './AccountSelect';

type Props = {
  accounts?: InjectedAccountWithMeta[];
  defaultAccount?: KeyringPair;
};

type AccountInputProps = Props;

const AccountInput = forwardRef<HTMLInputElement, AccountInputProps>(
  ({ accounts = [], defaultAccount }): JSX.Element => {
    const [accountValue, setAccountValue] = useState(defaultAccount?.address);

    const handleAccountChange = (account: string) => {
      setAccountValue(account);
    };

    const isSelectDisabled = !accounts?.length;

    return (
      <>
        <AccountInputLabel>Select Account</AccountInputLabel>
        <AccountSelect
          value={accountValue}
          isDisabled={isSelectDisabled}
          accounts={accounts}
          onChange={handleAccountChange}
        />
      </>
    );
  }
);

AccountInput.displayName = 'AccountInput';

export { AccountInput };
export type { AccountInputProps };
