import { Meta, Story } from '@storybook/react';
import { useState } from 'react';

import { CTA } from '../CTA';
import { Modal, ModalBody, ModalDivider, ModalFooter, ModalHeader, ModalProps } from '.';

const Template: Story<ModalProps & { hasFooter: boolean; hasTitle: boolean }> = ({
  isOpen: isOpenProp,
  children,
  hasFooter,
  hasTitle,
  ...args
}) => {
  // const state = useOverlayTriggerState({ defaultOpen: isOpen });
  const [isOpen, setOpen] = useState(isOpenProp);

  return (
    <>
      <CTA onClick={() => setOpen(true)} variant='primary'>
        Open modal
      </CTA>
      <Modal {...args} isOpen={isOpen} onClose={() => setOpen(false)}>
        {hasTitle && (
          <>
            <ModalHeader color='secondary' align='center'>
              Title
            </ModalHeader>
            <ModalDivider color='secondary' />
          </>
        )}
        <ModalBody>{children}</ModalBody>
        {hasFooter && (
          <ModalFooter>
            <CTA onClick={() => setOpen(false)}>Procced</CTA>
          </ModalFooter>
        )}
      </Modal>
    </>
  );
};

const Default = Template.bind({});
Default.args = {
  isOpen: false,
  children: (
    <>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
      Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    </>
  )
};

const WithTitle = Template.bind({});
WithTitle.args = {
  isOpen: false,
  hasTitle: true,
  children: (
    <>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
      Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    </>
  )
};

const WithFooter = Template.bind({});
WithFooter.args = {
  isOpen: false,
  hasFooter: true,
  children: (
    <>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
      Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    </>
  )
};

const LargeContent = Template.bind({});
LargeContent.args = {
  isOpen: false,
  hasFooter: true,
  hasTitle: true,
  children: (
    <>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
      Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
      fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur
      purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
      mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
      leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
      fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur
      purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
      mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
      leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
      fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur
      purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
      mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
      leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
      fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur
      purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
      mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
      leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
      fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur
      purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
      mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
      leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
      fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur
      purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
      mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
      leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
      fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur
      purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
      mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
      leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
      facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo
      cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo
      odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet
      fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur
      purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
      mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
      leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl
      consectetur et. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
      egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna,
      vel scelerisque nisl consectetur et.
    </>
  )
};

export { Default, LargeContent, WithFooter, WithTitle };

export default {
  title: 'Overlays/Modal',
  component: Modal
} as Meta;
