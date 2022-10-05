import { Meta, Story } from '@storybook/react';

import { formatPercentage } from '@/common/utils/utils';

import { NewVaultsTable, NewVaultsTableProps } from '.';

const Template: Story<NewVaultsTableProps> = (args) => <NewVaultsTable {...args} />;

const Default = Template.bind({});
Default.args = {
  data: [
    {
      collateralCurrency: 'KSM',
      wrappedCurrency: 'KBTC',
      minCollateralAmount: '1.21',
      collateralRate: formatPercentage(2.6012),
      isActive: true
    },
    {
      collateralCurrency: 'KINT',
      wrappedCurrency: 'KBTC',
      minCollateralAmount: '9.14',
      collateralRate: formatPercentage(3.1455),
      isActive: false
    }
  ]
};

export { Default };

export default {
  title: 'Components/NewVaultsTable',
  component: NewVaultsTable
} as Meta;
