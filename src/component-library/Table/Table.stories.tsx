import { Meta, Story } from '@storybook/react';

import { Table, TableProps } from '.';

const Template: Story<TableProps> = (args) => <Table {...args} />;

const Default = Template.bind({});
Default.args = {
  columnLabels: ['Name', 'Amount'],
  rows: [
    ['Alice', 2123],
    ['Bob', 12],
    ['Carol', 35]
  ]
};

export { Default };

export default {
  title: 'Components/Table',
  component: Table
} as Meta;
