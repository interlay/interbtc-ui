
import {
  Story,
  Meta
} from '@storybook/react';

import Tooltip, { Props } from './';

const Template: Story<Props> = args => <Tooltip {...args} />;

const Default = Template.bind({});
Default.args = {
  overlay: 'Tooltip',
  children: <span>Hover me!</span>
};

export {
  Default
};

export default {
  title: 'Tooltip',
  component: Tooltip
} as Meta;
