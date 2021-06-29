
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayRoseContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayRoseContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayRoseContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayRoseContainedButton',
  component: InterlayRoseContainedButton
} as Meta;
