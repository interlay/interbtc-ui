
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayTooltip, { Props } from '.';

const Template: Story<Props> = args => <InterlayTooltip {...args} />;

const Default = Template.bind({});
Default.args = {
  label: 'Save',
  children: <button style={{ fontSize: 25 }}>💾</button>
};

export {
  Default
};

export default {
  title: 'UI/InterlayTooltip',
  component: InterlayTooltip
} as Meta;
