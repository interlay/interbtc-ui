import { Meta,Story } from '@storybook/react';

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

const Default = Template.bind({});
Default.args = {
  diameter: 60,
  thickness: 5
};

export { Default };

export default {
  title: 'Elements/LoadingSpinner',
  component: LoadingSpinner
} as Meta;
