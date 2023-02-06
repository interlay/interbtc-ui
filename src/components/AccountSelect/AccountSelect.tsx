import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import { chain } from '@react-aria/utils';
import { useState } from 'react';

import { Flex } from '@/component-library';
import { SelectTrigger } from '@/component-library/Select';

import { StyledAccount } from './AccountInput.style';
import { AccountListModal } from './AccountListModal';

const Icon = ({ value }: Pick<AccountSelectProps, 'value'>) => {
  return <Identicon size={32} value={value} theme='polkadot' />;
};

type AccountSelectProps = {
  value?: string;
  icons?: string[];
  accounts: InjectedAccountWithMeta[];
  onChange: (account: string) => void;
  isDisabled?: boolean;
};

const AccountSelect = ({ value, accounts, isDisabled, onChange }: AccountSelectProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  const currentAccount = accounts.find((account) => account.address === value);

  const handleClose = () => setOpen(false);

  return (
    <>
      <SelectTrigger onPress={() => setOpen(true)} disabled={isDisabled}>
        <Flex elementType='span' alignItems='center' justifyContent='space-evenly' gap='spacing1'>
          <Icon value={currentAccount?.address} />
          <StyledAccount>
            {currentAccount?.meta.name} {currentAccount?.address}
          </StyledAccount>
        </Flex>
      </SelectTrigger>
      <AccountListModal
        isOpen={isOpen}
        accounts={accounts}
        selectedAccount={value}
        onClose={handleClose}
        onSelectionChange={chain(onChange, handleClose)}
      />
    </>
  );
};

export { AccountSelect };
export type { AccountSelectProps };
