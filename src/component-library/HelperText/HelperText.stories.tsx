import { Meta, Story } from '@storybook/react';

import { HelperText, HelperTextProps } from '.';

const Template: Story<HelperTextProps> = (args) => <HelperText {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'HelperText'
};

export { Default };

export default {
  title: 'Forms/HelperText',
  component: HelperText
} as Meta;
