
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayPurpleHeartContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayPurpleHeartContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayPurpleHeartContainedButton',
  style: {
    height: 36
  }
};

export {
  Default
};

export default {
  title: 'buttons/InterlayPurpleHeartContainedButton',
  component: InterlayPurpleHeartContainedButton
} as Meta;
