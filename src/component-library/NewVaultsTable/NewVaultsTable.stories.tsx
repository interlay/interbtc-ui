import { Story, Meta } from '@storybook/react';
// ray test touch <
import { CurrencyIdLiteral } from '@interlay/interbtc-api';
// ray test touch >

import { NewVaultsTable } from '.';
import { NewVaultsTableProps } from './NewVaultsTable';

const Template: Story<NewVaultsTableProps> = (args) => <NewVaultsTable {...args} />;

const Default = Template.bind({});
Default.args = {
  data: [
    {
      // ray test touch <
      collateralCurrency: CurrencyIdLiteral.KSM,
      wrappedCurrency: CurrencyIdLiteral.KBTC,
      // ray test touch >
      minCollateralAmount: '1.21',
      collateralRate: '260.12',
      isActive: true,
      ctaOnClick: () => alert('add vault')
    },
    {
      // ray test touch <
      collateralCurrency: CurrencyIdLiteral.KINT,
      wrappedCurrency: CurrencyIdLiteral.KBTC,
      // ray test touch >
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
