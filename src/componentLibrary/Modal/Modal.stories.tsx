import { Story, Meta } from '@storybook/react';

import { Modal, ModalProps } from '.';

const Template: Story<ModalProps> = args => <Modal {...args} />;

const Default = Template.bind({});
Default.args = {
  open: true,
  onClose: () => alert('close')
};

export {
  Default
};

export default {
  title: 'Components/Modal',
  component: Modal
} as Meta;
