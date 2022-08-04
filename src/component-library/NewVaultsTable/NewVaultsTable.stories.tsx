import { Meta, Story } from '@storybook/react';

import { NewVaultsTable, NewVaultsTableProps } from '.';

const Template: Story<NewVaultsTableProps> = (args) => <NewVaultsTable {...args} />;

const Default = Template.bind({});
Default.args = {
  data: [
    {
      collateralCurrency: 'KSM',
      wrappedCurrency: 'KBTC',
      minCollateralAmount: '1.21',
      collateralRate: '260.12',
      isActive: true,
      ctaOnClick: () => alert('add vault')
    },
    {
      collateralCurrency: 'KINT',
      wrappedCurrency: 'KBTC',
      minCollateralAmount: '9.14',
      collateralRate: '314.55',
      isActive: false,
      ctaOnClick: () => alert('add vault')
    }
  ]
};

export { Default };

export default {
  title: 'Components/NewVaultsTable',
  component: NewVaultsTable
} as Meta;
