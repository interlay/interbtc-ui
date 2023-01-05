import { useState } from 'react';

import { Cog } from '@/assets/icons';
import { List, ListItem, ListProps, Modal, ModalBody, ModalHeader } from '@/component-library';
import { SwapSlippage } from '@/types/swap';

import { StyledCTA } from './SlippageManager.style';

type SlippageManagerProps = {
  value: SwapSlippage;
  onChange: (slippage: SwapSlippage) => void;
};

const SlippageManager = ({ value, onChange }: SlippageManagerProps): JSX.Element | null => {
  const [isOpen, setOpen] = useState(false);

  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    if (!selectedKey) return;

    onChange?.(selectedKey as SwapSlippage);
  };

  return (
    <>
      <StyledCTA size='small' variant='text' onPress={() => setOpen(true)}>
        <Cog />
      </StyledCTA>
      <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
        <ModalHeader color='secondary' align='start'>
          Set Slippage Tolerance
        </ModalHeader>
        <ModalBody>
          <List
            aria-label='slippage tolerance'
            direction='row'
            selectionMode='single'
            onSelectionChange={handleSelectionChange}
            defaultSelectedKeys={[value]}
          >
            <ListItem key='0.1%'>0.1%</ListItem>
            <ListItem key='0.5%'>0.5%</ListItem>
            <ListItem key='1%'>1%</ListItem>
            <ListItem key='3%'>3%</ListItem>
          </List>
        </ModalBody>
      </Modal>
    </>
  );
};

export { SlippageManager };
export type { SlippageManagerProps };
