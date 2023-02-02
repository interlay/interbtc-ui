import { useRef, useState } from 'react';

import { SelectTrigger } from '@/component-library/Select/SelectTrigger';

import { AccountSelectorModal } from './AccountSelectorModal';

const AccountSelector = (): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  const tokenButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <SelectTrigger onPress={() => setOpen(true)} ref={tokenButtonRef} placeholder='Select account' />
      <AccountSelectorModal onClose={() => setOpen(false)} isOpen={isOpen}>
        <p>A child</p>
      </AccountSelectorModal>
    </>
  );
};

export { AccountSelector };
