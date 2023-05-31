import { Meta, Story } from '@storybook/react';

import { CTA } from '../CTA';
import { Dialog, DialogBody, DialogDivider, DialogFooter, DialogHeader, DialogProps } from '.';

const Template: Story<DialogProps & { hasFooter: boolean; hasTitle: boolean }> = ({
  children,
  hasFooter,
  hasTitle,
  ...args
}) => {
  return (
    <>
      <Dialog {...args} onClose={console.log}>
        {hasTitle && (
          <>
            <DialogHeader color='secondary' align='center'>
              Title
            </DialogHeader>
            <DialogDivider color='secondary' />
          </>
        )}
        <DialogBody>{children}</DialogBody>
        {hasFooter && (
          <DialogFooter>
            <CTA onPress={console.log}>Procced</CTA>
          </DialogFooter>
        )}
      </Dialog>
    </>
  );
};

const Default = Template.bind({});
Default.args = {
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
  title: 'Overlays/Dialog',
  component: Dialog
} as Meta;
