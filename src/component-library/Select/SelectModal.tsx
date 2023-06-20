import { useId } from '@react-aria/utils';
import { SelectState } from '@react-stately/select';
import { forwardRef, ReactNode } from 'react';

import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library/Modal';

import { ListItem, ListProps } from '../List';
import { StyledList } from './Select.style';
import { SelectModalContext } from './SelectModalContext';

type Props = {
  state: SelectState<unknown>;
  title?: ReactNode;
  listProps?: Omit<ListProps, 'children'>;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type SelectModalProps = Props & InheritAttrs;

const SelectModal = forwardRef<HTMLDivElement, SelectModalProps>(
  ({ state, title, onClose, listProps, ...props }, ref): JSX.Element => {
    const headerId = useId();

    const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
      const [selectedKey] = [...key];

      if (!selectedKey) {
        return onClose();
      }

      state.selectionManager.setSelectedKeys(key);
      onClose();
    };

    return (
      <SelectModalContext.Provider value={{ selectedItem: state.selectedItem }}>
        <Modal ref={ref} hasMaxHeight onClose={onClose} {...props}>
          <ModalHeader id={headerId} size='lg' weight='medium' color='secondary'>
            {title}
          </ModalHeader>
          <ModalBody overflow='hidden' noPadding>
            <StyledList
              {...listProps}
              aria-labelledby={headerId}
              variant='secondary'
              selectionMode='single'
              onSelectionChange={handleSelectionChange}
            >
              {[...state.collection].map((item) => (
                <ListItem
                  key={item.key}
                  textValue={item.textValue}
                  alignItems='center'
                  justifyContent='space-between'
                  gap='spacing2'
                >
                  {item.rendered}
                </ListItem>
              ))}
            </StyledList>
          </ModalBody>
        </Modal>
      </SelectModalContext.Provider>
    );
  }
);

SelectModal.displayName = 'SelectModal';

export { SelectModal };
