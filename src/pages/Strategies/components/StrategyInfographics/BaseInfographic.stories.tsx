import { Meta, Story } from '@storybook/react';

import { BaseInfographics, BaseInfographicsProps } from './BaseInfographics';
import { InfographicsToken } from './InfographicToken';

const Template: Story<BaseInfographicsProps> = (args) => (
  <BaseInfographics {...args}>
    {/* <BaseInfographicsItem label='Deposit IBTC'></BaseInfographicsItem>
    <BaseInfographicsItem label='Provide IBTC to borrow market'></BaseInfographicsItem>
    <BaseInfographicsItem label='Earn interest'></BaseInfographicsItem> */}
  </BaseInfographics>
);

const Default = Template.bind({});
Default.args = {
  items: [
    { icon: <InfographicsToken ticker='IBTC' />, label: 'Deposit IBTC' },
    { icon: <InfographicsToken ticker='IBTC' />, label: 'Provide IBTC to borrow market' },
    { icon: <InfographicsToken ticker={['IBTC', 'USDT']} />, label: 'Earn interest' }
  ]
};

export { Default };

export default {
  title: 'Components/BaseInfographics',
  component: BaseInfographics
} as Meta;
