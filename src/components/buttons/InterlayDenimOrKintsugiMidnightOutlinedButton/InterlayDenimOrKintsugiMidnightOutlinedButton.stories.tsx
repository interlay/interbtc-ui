
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDenimOrKintsugiMidnightOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayDenimOrKintsugiMidnightOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayDenimOrKintsugiMidnightOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayDenimOrKintsugiMidnightOutlinedButton',
  component: InterlayDenimOrKintsugiMidnightOutlinedButton
} as Meta;
