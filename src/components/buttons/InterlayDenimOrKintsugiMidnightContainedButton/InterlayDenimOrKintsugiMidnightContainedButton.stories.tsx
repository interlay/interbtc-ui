
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDenimOrKintsugiMidnightContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayDenimOrKintsugiMidnightContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayDenimOrKintsugiMidnightContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayDenimOrKintsugiMidnightContainedButton',
  component: InterlayDenimOrKintsugiMidnightContainedButton
} as Meta;
