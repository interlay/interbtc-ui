import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library/Modal';

import { AccountList } from './AccountList';

type Props = {
  accounts: InjectedAccountWithMeta[];
  onSelectionChange?: (account: string) => void;
  selectedAccount?: string;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type AccountListModalProps = Props & InheritAttrs;

const AccountListModal = ({
  selectedAccount,
  accounts,
  onSelectionChange,
  ...props
}: AccountListModalProps): JSX.Element => (
  <Modal hasMaxHeight {...props}>
    <ModalHeader size='lg' weight='medium' color='secondary'>
      Select Account
    </ModalHeader>
    <ModalBody overflow='hidden'>
      <AccountList items={accounts} selectedAccount={selectedAccount} onSelectionChange={onSelectionChange} />
    </ModalBody>
  </Modal>
);

export { AccountListModal };
export type { AccountListModalProps };
