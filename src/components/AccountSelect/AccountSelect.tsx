import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import { useButton } from '@react-aria/button';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { ChangeEventHandler, InputHTMLAttributes, useRef, useState } from 'react';

import { assignFormRef, triggerChangeEvent } from '@/component-library/utils/input';

import { StyledAccount, StyledAccountSelect, StyledChevronDown } from './AccountInput.style';
import { AccountListModal } from './AccountListModal';

const Icon = ({ value }: Pick<AccountSelectProps, 'value'>) => {
  return <Identicon size={32} value={value} theme='polkadot' />;
};

type SelectProps = InputHTMLAttributes<HTMLInputElement> & { ref?: any };

type AccountSelectProps = {
  value?: string;
  isDisabled: boolean;
  accounts: InjectedAccountWithMeta[];
  onChange: (account: string) => void;
  selectProps?: SelectProps;
};

const AccountSelect = ({ value, accounts, onChange, selectProps }: AccountSelectProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  const accountButtonRef = useRef<HTMLDivElement>(null);

  const { ref: selectRef, ...inputProps } = selectProps || {};
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { buttonProps } = useButton(
    {
      onPress: () => setOpen(true),
      elementType: 'div'
    },
    accountButtonRef
  );

  const handleClose = () => setOpen(false);

  const handleSelectionChange = (account: string) => triggerChangeEvent(inputRef, account);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => onChange(e.target.value);

  return (
    <>
      <StyledAccountSelect
        ref={accountButtonRef}
        alignItems='center'
        justifyContent='space-evenly'
        gap='spacing1'
        $isClickable={true}
        {...buttonProps}
      >
        <Icon value={value} />
        <StyledAccount>{value || 'Select Account'}</StyledAccount>
        <>
          <StyledChevronDown size='s' />
          <VisuallyHidden>
            <input
              // TODO: react-hook-forms sets initial value using ref
              // so we will need to keep up out state with that initial value
              // using our ref.
              ref={assignFormRef(selectRef, inputRef)}
              {...mergeProps(inputProps, { onChange: handleChange })}
              autoComplete='off'
              tabIndex={-1}
              value={value}
            />
          </VisuallyHidden>
        </>
      </StyledAccountSelect>
      <AccountListModal
        isOpen={isOpen}
        accounts={accounts}
        selectedAccount={value}
        onClose={handleClose}
        onSelectionChange={chain(onChange, handleSelectionChange, handleClose)}
      />
    </>
  );
};

export { AccountSelect };
export type { AccountSelectProps };
