import { Story, Meta } from '@storybook/react';

import { CurrencySymbols } from 'types/currency';
import { NewVaultsTable } from '.';
import { NewVaultsTableProps } from './NewVaultsTable';

const Template: Story<NewVaultsTableProps> = (args) => <NewVaultsTable {...args} />;

const Default = Template.bind({});
Default.args = {
  data: [
    {
      collateralCurrency: CurrencySymbols.KSM,
      wrappedCurrency: CurrencySymbols.KBTC,
      apy: '11.23',
      minCollateralAmount: '1.21',
      collateralRate: '260.12',
      isActive: true,
      ctaOnClick: () => alert('add vault')
    },
    {
      collateralCurrency: CurrencySymbols.KINT,
      wrappedCurrency: CurrencySymbols.KBTC,
      apy: '430.33',
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
