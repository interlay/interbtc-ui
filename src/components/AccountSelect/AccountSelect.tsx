import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useLabel } from '@react-aria/label';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

import { Flex, Label } from '@/component-library';
import { SelectTrigger } from '@/component-library/Select';
import { useDOMRef } from '@/component-library/utils/dom';
import { triggerChangeEvent } from '@/component-library/utils/input';

import { AccountLabel } from './AccountLabel';
import { AccountListModal } from './AccountListModal';

const getAccount = (accountValue?: string, accounts?: InjectedAccountWithMeta[]) =>
  accounts?.find((account) => account.address === accountValue);

type Props = {
  value?: string;
  defaultValue?: string;
  icons?: string[];
  isDisabled?: boolean;
  label?: ReactNode;
  accounts?: InjectedAccountWithMeta[];
};

type NativeAttrs = Omit<InputHTMLAttributes<HTMLInputElement> & { ref?: any }, keyof Props>;

type AccountSelectProps = Props & NativeAttrs;

const AccountSelect = forwardRef<HTMLInputElement, AccountSelectProps>(
  ({ value: valueProp, defaultValue, accounts, disabled, label, className, ...props }, ref): JSX.Element => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const inputRef = useDOMRef(ref);

    const [isOpen, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);

    const { fieldProps, labelProps } = useLabel({ ...props, label });

    useEffect(() => {
      if (valueProp === undefined) return;

      setValue(valueProp);
    }, [valueProp]);

    const handleAccount = (account: string) => {
      triggerChangeEvent(inputRef, account);
      setValue(account);
    };

    const handleClose = () => setOpen(false);

    const isDisabled = !accounts?.length || disabled;

    const selectedAccount = getAccount(value, accounts);

    return (
      <>
        <Flex direction='column' className={className}>
          {label && <Label {...labelProps}>{label}</Label>}
          <SelectTrigger ref={btnRef} size='large' onPress={() => setOpen(true)} disabled={isDisabled}>
            {selectedAccount && <AccountLabel address={selectedAccount.address} name={selectedAccount.meta.name} />}
          </SelectTrigger>
          <VisuallyHidden>
            <input
              ref={inputRef}
              autoComplete='off'
              tabIndex={-1}
              value={value}
              {...mergeProps(props, fieldProps, { onFocus: () => btnRef.current?.focus() })}
            />
          </VisuallyHidden>
        </Flex>
        {accounts && (
          <AccountListModal
            isOpen={isOpen}
            accounts={accounts}
            selectedAccount={selectedAccount?.address}
            onClose={handleClose}
            onSelectionChange={chain(handleAccount, handleClose)}
          />
        )}
      </>
    );
  }
);

AccountSelect.displayName = 'AccountSelect';

export { AccountSelect };
export type { AccountSelectProps };
