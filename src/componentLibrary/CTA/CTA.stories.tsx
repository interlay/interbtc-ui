
import {
  Story,
  Meta
} from '@storybook/react';

import { CTA, CTAProps } from '.';

const Template: Story<CTAProps> = args => <CTA {...args} />;

const Primary = Template.bind({});
Primary.args = {
  children: 'cta text'
};

export {
  Primary
};

export default {
  title: 'Component Library/CTA',
  component: CTA
} as Meta;
