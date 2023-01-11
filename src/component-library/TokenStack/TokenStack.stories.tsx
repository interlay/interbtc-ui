import { Meta, Story } from '@storybook/react';

import { TokenStack, TokenStackProps } from '.';

const Template: Story<TokenStackProps> = (args) => <TokenStack {...args} />;

const Default = Template.bind({});
Default.args = {
  tickers: ['IBTC', 'KBTC', 'KINT', 'INTR'],
  size: 'xl2'
};

export { Default };

export default {
  title: 'Elements/TokenStack',
  component: TokenStack
} as Meta;
