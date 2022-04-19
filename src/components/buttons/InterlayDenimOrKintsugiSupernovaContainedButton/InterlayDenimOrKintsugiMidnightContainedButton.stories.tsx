
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDenimOrKintsugiSupernovaContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayDenimOrKintsugiSupernovaContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayDenimOrKintsugiMidnightContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayDenimOrKintsugiMidnightContainedButton',
  component: InterlayDenimOrKintsugiSupernovaContainedButton
} as Meta;
