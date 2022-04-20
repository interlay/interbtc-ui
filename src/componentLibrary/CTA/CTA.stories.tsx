
import {
  Story,
  Meta
} from '@storybook/react';

import { CTA, CTAProps } from '.';

const Template: Story<CTAProps> = args => <CTA {...args} />;

const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'cta text'
};

const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'cta text'
};

export {
  Primary,
  Secondary
};

export default {
  title: 'Component Library/CTA',
  component: CTA
} as Meta;
