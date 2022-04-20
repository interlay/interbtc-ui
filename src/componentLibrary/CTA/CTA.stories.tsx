
import {
  Story,
  Meta
} from '@storybook/react';

import { CTA, CTAProps } from '.';

const Template: Story<CTAProps> = args => <CTA {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'cta text'
};

export {
  Default
};

export default {
  title: 'Component Library/CTA',
  component: CTA
} as Meta;
