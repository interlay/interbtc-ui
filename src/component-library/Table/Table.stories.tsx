import { Meta, Story } from '@storybook/react';

import { ColumnProps, RowProps, Table, TableProps } from '.';

const Template: Story<TableProps> = (args) => {
  const columns: ColumnProps[] = [
    { name: 'Coin', uid: 'coin' },
    { name: 'Price', uid: 'price' },
    { name: 'Mkt Cap', uid: 'market-cap' }
  ];

  const rows: RowProps[] = [
    { id: 1, coin: 'BTC', price: '$22,996.31', 'market-cap': '$439,503,832,639' },
    { id: 2, coin: 'DOT', price: '$8.13', 'market-cap': '$9,250,245,618' },
    { id: 3, coin: 'KINT', price: '$2.80', 'market-cap': '$2,397,911' },
    { id: 4, coin: 'kBTC', price: '$23,074.29', 'market-cap': '-' }
  ];
  return <Table {...args} columns={columns} rows={rows} aria-label='story table' style={{ padding: 20 }} />;
};

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Components/Table',
  component: Table
} as Meta;
