import { Meta, Story } from '@storybook/react';
import { useEffect, useState } from 'react';

import { CTA } from '../CTA';
import { Modal, ModalBody, ModalFooter, ModalProps } from '.';

const Template: Story<ModalProps> = (args) => {
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => setOpen(false);
  const handleOpenModal = () => setOpen(true);

  useEffect(() => {
    setOpen(args.open);
  }, [args.open]);

  console.log(open);

  return (
    <>
      <CTA onClick={handleOpenModal} variant='primary'>
        Open modal
      </CTA>
      <Modal {...args} open={open} onClose={onClose}>
        <ModalBody>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
          Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque
          nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
          in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
          fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
          ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis
          consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
          risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et.
        </ModalBody>
        <ModalFooter>
          <CTA>Procced</CTA>
        </ModalFooter>
      </Modal>
    </>
  );
};

const Default = Template.bind({});
Default.args = {
  open: false,
  title: 'This a title'
};

export { Default };

export default {
  title: 'Components/Modal',
  component: Modal
} as Meta;
