
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayOrangePeelContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayOrangePeelContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayOrangePeelContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayOrangePeelContainedButton',
  component: InterlayOrangePeelContainedButton
} as Meta;
