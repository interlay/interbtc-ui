import { forwardRef, useState } from 'react';

import { Cog } from '@/assets/icons';
import { List, ListItem, ListProps, Modal, ModalBody, ModalHeader } from '@/component-library';

import { StyledCTA } from './SlippageManager.style';

type SlippageManagerProps = {
  value: number;
  onChange: (slippage: number) => void;
};

const SlippageManager = forwardRef<HTMLDivElement, SlippageManagerProps>(
  ({ value, onChange }, ref): JSX.Element => {
    const [isOpen, setOpen] = useState(false);

    const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
      const [selectedKey] = [...key];

      if (!selectedKey) {
        return setOpen(false);
      }

      onChange?.(Number(selectedKey));
      setOpen(false);
    };

    return (
      <>
        <StyledCTA aria-label='slippage settings' size='small' variant='text' onPress={() => setOpen(true)}>
          <Cog />
        </StyledCTA>
        <Modal ref={ref} isOpen={isOpen} onClose={() => setOpen(false)}>
          <ModalHeader color='secondary' align='start'>
            Set Slippage Tolerance
          </ModalHeader>
          <ModalBody>
            <List
              aria-label='slippage tolerance'
              direction='row'
              selectionMode='single'
              onSelectionChange={handleSelectionChange}
              defaultSelectedKeys={[value.toString()]}
            >
              <ListItem textValue='0' key='0'>
                0%
              </ListItem>
              <ListItem textValue='0.1' key='0.1'>
                0.1%
              </ListItem>
              <ListItem textValue='0.5' key='0.5'>
                0.5%
              </ListItem>
              <ListItem textValue='1' key='1'>
                1%
              </ListItem>
              <ListItem textValue='3' key='3'>
                3%
              </ListItem>
            </List>
          </ModalBody>
        </Modal>
      </>
    );
  }
);

SlippageManager.displayName = 'SlippageManager';

export { SlippageManager };
export type { SlippageManagerProps };
