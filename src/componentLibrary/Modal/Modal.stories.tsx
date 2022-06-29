import { Story, Meta } from '@storybook/react';
import { useEffect, useState } from 'react';

import { Modal, ModalProps } from '.';
import { CTA } from '../CTA';

const Template: Story<ModalProps> = (args) => {
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => setOpen(false);
  const handleOpenModal = () => setOpen(true);

  useEffect(() => {
    setOpen(args.open);
  }, [args.open]);

  return (
    <>
      <CTA onClick={handleOpenModal} variant='primary'>
        Open modal
      </CTA>
      <Modal {...args} open={open} onClose={onClose}>
        Test.
      </Modal>
    </>
  );
};

const Default = Template.bind({});
Default.args = {
  open: false
};

export { Default };

export default {
  title: 'Components/Modal',
  component: Modal
} as Meta;
