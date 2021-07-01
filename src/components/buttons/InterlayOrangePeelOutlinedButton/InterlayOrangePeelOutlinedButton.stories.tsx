
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayOrangePeelOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayOrangePeelOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayOrangePeelOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayOrangePeelOutlinedButton',
  component: InterlayOrangePeelOutlinedButton
} as Meta;
