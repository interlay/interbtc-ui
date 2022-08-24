import { Meta, Story } from '@storybook/react';

import { LoadingSpinner, LoadingSpinnerProps } from '.';

const Template: Story<LoadingSpinnerProps> = (args) => (
  <div
    style={{
      width: '100%',
      height: '300px',
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <LoadingSpinner {...args} />
  </div>
);

const Determinate = Template.bind({});

Determinate.args = {
  diameter: 60,
  thickness: 5,
  variant: 'determinate'
};

const Indeterminate = Template.bind({});

Indeterminate.args = {
  diameter: 60,
  thickness: 5,
  variant: 'indeterminate'
};

export { Determinate, Indeterminate };

export default {
  title: 'Elements/LoadingSpinner',
  component: LoadingSpinner
} as Meta;
