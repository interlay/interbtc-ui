
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDenimOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayDenimOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayDenimOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayDenimOutlinedButton',
  component: InterlayDenimOutlinedButton
} as Meta;
