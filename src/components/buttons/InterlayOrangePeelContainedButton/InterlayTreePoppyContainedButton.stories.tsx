
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayOrangePeelContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayOrangePeelContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayTreePoppyContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayTreePoppyContainedButton',
  component: InterlayOrangePeelContainedButton
} as Meta;
