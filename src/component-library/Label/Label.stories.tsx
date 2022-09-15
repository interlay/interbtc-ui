import { Meta, Story } from '@storybook/react';

import { Label, LabelProps } from '.';

const Template: Story<LabelProps> = (args) => <Label {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'Label'
};

export { Default };

export default {
  title: 'Forms/Label',
  component: Label
} as Meta;
