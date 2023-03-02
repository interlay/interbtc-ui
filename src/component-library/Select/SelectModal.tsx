import { SelectState } from '@react-stately/select';
import { forwardRef, Key } from 'react';

import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library/Modal';

import { ListItem, ListProps } from '../List';
import { StyledList } from './Select.style';
import { SelectModalContext } from './SelectModalContext';

type Props = {
  onSelectionChange?: (key: Key) => void;
  selectedAccount?: Key;
  state: SelectState<unknown>;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type SelectModalProps = Props & InheritAttrs;

const SelectModal = forwardRef<HTMLDivElement, SelectModalProps>(
  ({ selectedAccount, state, onSelectionChange, onClose, ...props }, ref): JSX.Element => {
    const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
      const [selectedKey] = [...key];

      if (!selectedKey) return;

      onSelectionChange?.(selectedKey);
      state.selectionManager.setSelectedKeys(key);
      onClose();
    };

    return (
      <SelectModalContext.Provider value={{ selectedItem: state.selectedItem }}>
        <Modal ref={ref} hasMaxHeight onClose={onClose} {...props}>
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
            </StyledList>
          </ModalBody>
        </Modal>
      </SelectModalContext.Provider>
    );
  }
);

SelectModal.displayName = 'SelectModal';

export { SelectModal };
