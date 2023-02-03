import { useRef, useState } from 'react';

import { SelectTrigger } from '@/component-library/Select/SelectTrigger';
import { useSubstrateSecureState } from '@/lib/substrate';

import { AccountSelectorModal } from './AccountListModal';

const AccountSelector = (): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  const { selectedAccount, accounts } = useSubstrateSecureState();
  console.log(selectedAccount);

  const tokenButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <SelectTrigger onPress={() => setOpen(true)} ref={tokenButtonRef} placeholder='Select account' />
      <AccountSelectorModal accounts={accounts} onClose={() => setOpen(false)} isOpen={isOpen} />
    </>
  );
};

export { AccountSelector };
