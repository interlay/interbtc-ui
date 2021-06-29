
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayMalachiteOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayMalachiteOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayMalachiteOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayMalachiteOutlinedButton',
  component: InterlayMalachiteOutlinedButton
} as Meta;
