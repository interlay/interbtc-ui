import { Meta, Story } from '@storybook/react';

import { CTA } from '../CTA';
import { Tooltip, TooltipProps } from '.';

const Template: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <CTA style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>Hover Me</CTA>
  </Tooltip>
);

const Default = Template.bind({});
Default.args = { label: 'Your are awesome 👊🏼', placement: 'top' };

const TextTemplate: Story<TooltipProps> = (args) => (
  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
    <Tooltip {...args}>Hover Me</Tooltip>
  </div>
);

const Text = TextTemplate.bind({});
Text.args = { label: 'Your are awesome 👊🏼', placement: 'top' };

export { Default, Text };

export default {
  title: 'Overlays/Tooltip',
  component: Tooltip
} as Meta;
