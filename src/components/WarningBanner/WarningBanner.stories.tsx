
import {
  Story,
  Meta
} from '@storybook/react';

import WarningBanner, { Props } from '.';

const Template: Story<Props> = args => <WarningBanner {...args} />;

const Default = Template.bind({});
Default.args = {
  message: 'WarningBanner'
};

export {
  Default
};

export default {
  title: 'WarningBanner',
  component: WarningBanner
} as Meta;
