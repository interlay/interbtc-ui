import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';

import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library';

type Props = {
  accounts: InjectedAccountWithMeta[];
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type TokenListModalProps = Props & InheritAttrs;

const AccountSelectorModal = ({ accounts, ...props }: TokenListModalProps): JSX.Element => (
  <Modal hasMaxHeight {...props}>
    <ModalHeader size='lg' weight='medium' color='secondary'>
      Select Account
    </ModalHeader>
    <ModalBody overflow='hidden' noPadding>
      {accounts.map((account) => (
        <p key={account.address}>
          <Identicon value={account.address} theme='polkadot' />
          {account.address}
        </p>
      ))}
    </ModalBody>
  </Modal>
);

export { AccountSelectorModal };
