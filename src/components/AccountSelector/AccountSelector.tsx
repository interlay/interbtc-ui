import { SelectTrigger } from '@/component-library/Select/SelectTrigger';

import { AccountSelectorModal } from './AccountSelectorModal';

const AccountSelector = (): JSX.Element => (
  <>
    <SelectTrigger placeholder='Select account' />
    <AccountSelectorModal isOpen={true}>
      <p>A child</p>
    </AccountSelectorModal>
  </>
);

export { AccountSelector };
