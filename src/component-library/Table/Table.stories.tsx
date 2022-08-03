import { Meta, Story } from '@storybook/react';

import { Table, TableProps } from '.';

const Template: Story<TableProps> = (args) => {
  const columns = [
    { name: 'Name', uid: 'name' },
    { name: 'Type', uid: 'type' },
    { name: 'Level', uid: 'level' }
  ];

  const rows = [
    { id: 1, name: 'Charizard', type: 'Fire, Flying', level: '67' },
    { id: 2, name: 'Blastoise', type: 'Water', level: '56' },
    { id: 3, name: 'Venusaur', type: 'Grass, Poison', level: '83' },
    { id: 4, name: 'Pikachu', type: 'Electric', level: '100' }
  ];
  return <Table {...args} columns={columns} rows={rows} aria-label='story table' style={{ padding: 20 }} />;
};

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Components/NewTable',
  component: Table
} as Meta;
