
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayButton, { Props } from './';

const Template: Story<Props> = args => <InterlayButton {...args} />;

const ContainedPrimary = Template.bind({});
ContainedPrimary.args = {
  children: 'InterlayButton',
  color: 'primary',
  variant: 'contained'
};

export {
  ContainedPrimary
};

export default {
  title: 'UI/InterlayButton',
  component: InterlayButton
} as Meta;
