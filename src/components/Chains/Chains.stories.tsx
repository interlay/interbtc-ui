import {
  Story,
  Meta
} from '@storybook/react';

import Chains from './';

const Template: Story = () => {
  return (
    <Chains />
  );
};

const Default = Template.bind({});

export {
  Default
};

export default {
  title: 'Chains',
  component: Chains
} as Meta;
