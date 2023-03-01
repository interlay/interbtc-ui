import { ListState } from '@react-stately/list';
import { Key } from 'react';

import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library/Modal';

import { ListItem, ListProps } from '../List';
import { StyledList } from './Select.style';

type Props = {
  onSelectionChange?: (key: Key) => void;
  selectedAccount?: Key;
  state: ListState<unknown>;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type SelectModalProps = Props & InheritAttrs;

const SelectModal = ({ selectedAccount, state, onSelectionChange, ...props }: SelectModalProps): JSX.Element => {
  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    if (!selectedKey) return;

    onSelectionChange?.(selectedKey);
    state.selectionManager.setSelectedKeys(key);
  };

  return (
    <Modal hasMaxHeight {...props}>
      <ModalHeader size='lg' weight='medium' color='secondary'>
        Select Account
      </ModalHeader>
      <ModalBody overflow='hidden' noPadding>
        <StyledList
          aria-label='select account'
          variant='secondary'
          selectionMode='single'
          onSelectionChange={handleSelectionChange}
          selectedKeys={selectedAccount ? [selectedAccount] : undefined}
          {...props}
        >
          {[...state.collection].map((item) => {
            return (
              <ListItem
                key={item.key}
                textValue={item.textValue}
                alignItems='center'
                justifyContent='space-between'
                gap='spacing2'
              >
                {item.rendered}
              </ListItem>
            );
          })}
          {}
        </StyledList>
      </ModalBody>
    </Modal>
  );
};

export { SelectModal };
