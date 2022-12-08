import { Meta, Story } from '@storybook/react';

import { Alert, AlertProps } from '.';

const Template: Story<AlertProps> = (args) => <Alert {...args} />;

const Error = Template.bind({});
Error.args = {
  status: 'error',
  children: 'Error happened, please contact our support.'
};

const Warning = Template.bind({});
Warning.args = {
  children: 'This is a warning message...',
  status: 'warning'
};

const Success = Template.bind({});
Success.args = {
  children: 'Transaction was succesful!',
  status: 'success'
};

export { Error, Warning };

export default {
  title: 'Components/Alert',
  component: Alert
} as Meta;
