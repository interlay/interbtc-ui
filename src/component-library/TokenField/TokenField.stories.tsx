// ray test touch <
import { Story, Meta } from '@storybook/react';

import { TokenField, TokenFieldProps } from '.';

const Template: Story<TokenFieldProps> = (args) => <TokenField {...args} />;

const Default = Template.bind({});
Default.args = {
  label: 'KSM',
  approxUSD: '100.00'
};

export { Default };

export default {
  title: 'Forms/TokenField',
  component: TokenField
} as Meta;
// ray test touch >
