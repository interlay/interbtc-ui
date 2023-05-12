import { Meta, Story } from '@storybook/react';

import { Spinner, SpinnerProps } from '.';

const Template: Story<SpinnerProps> = (args) => (
  <Spinner
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    {...args}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
  </Spinner>
);

const Default = Template.bind({});
Default.args = {
  color: 'primary',
  size: 'md'
};

export { Default };

export default {
  title: 'Elements/Spinner',
  component: Spinner
} as Meta;
