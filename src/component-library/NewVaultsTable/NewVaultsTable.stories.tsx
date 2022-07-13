import { Story, Meta } from '@storybook/react';
import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { NewVaultsTable } from '.';
import { NewVaultsTableProps } from './NewVaultsTable';

const Template: Story<NewVaultsTableProps> = (args) => <NewVaultsTable {...args} />;

const Default = Template.bind({});
Default.args = {
  data: [
    {
      collateralCurrency: CurrencyIdLiteral.KSM,
      wrappedCurrency: CurrencyIdLiteral.KBTC,
      minCollateralAmount: '1.21',
      collateralRate: '260.12',
      isActive: true,
      ctaOnClick: () => alert('add vault')
    },
    {
      collateralCurrency: CurrencyIdLiteral.KINT,
      wrappedCurrency: CurrencyIdLiteral.KBTC,
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
