import {
  Story,
  Meta
} from '@storybook/react';

import Accounts from './';

const Template: Story = () => {
  return (
    <Accounts />
  );
};

const Default = Template.bind({});

export {
  Default
};

export default {
  title: 'Chains',
  component: Accounts
} as Meta;
