import { Meta, Story } from '@storybook/react';

import { Icon, IconProps } from '.';

const Template: Story<IconProps> = (args) => (
  <Icon
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    {...args}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
  </Icon>
);

const Default = Template.bind({});
Default.args = {
  color: 'primary',
  size: 'base'
};

export { Default };

export default {
  title: 'Elements/Icon',
  component: Icon
} as Meta;
