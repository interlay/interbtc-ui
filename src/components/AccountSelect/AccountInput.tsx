import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { forwardRef, InputHTMLAttributes, useEffect, useState } from 'react';

import { KeyringPair } from '@/lib/substrate';

import { AccountInputLabel } from './AccountInputLabel';
import { AccountSelect } from './AccountSelect';

type Props = {
  accounts?: InjectedAccountWithMeta[];
  selectedAccount?: KeyringPair;
  selectProps?: InputHTMLAttributes<HTMLInputElement>;
};

type AccountInputProps = Props;

const AccountInput = forwardRef<HTMLInputElement, AccountInputProps>(
  ({ accounts = [], selectedAccount, selectProps }): JSX.Element => {
    const [accountValue, setAccountValue] = useState(selectedAccount?.address as string);

    useEffect(() => {
      if (selectProps?.value === undefined) return;

      setAccountValue(selectProps.value as string);
    }, [selectProps?.value]);

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
          selectProps={selectProps}
        />
      </>
    );
  }
);

AccountInput.displayName = 'AccountInput';

export { AccountInput };
export type { AccountInputProps };
