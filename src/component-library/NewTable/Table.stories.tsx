import { useAsyncList } from '@react-stately/data';
import { Meta, Story } from '@storybook/react';

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableProps, TableRow } from '.';

const Template: Story<TableProps> = (args) => {
  return (
    <Table {...args}>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Type</TableColumn>
        <TableColumn>Date Modified</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Games</TableCell>
          <TableCell>File folder</TableCell>
          <TableCell>6/7/2020</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Program Files</TableCell>
          <TableCell>File folder</TableCell>
          <TableCell>4/7/2021</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>bootmgr</TableCell>
          <TableCell>System file</TableCell>
          <TableCell>11/20/2010</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>log.txt</TableCell>
          <TableCell>Text Document</TableCell>
          <TableCell>1/18/2016</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const Default = Template.bind({});
Default.args = {};

const SortingTemplate: Story<TableProps> = (args) => {
  const list = useAsyncList({
    async load() {
      return {
        items: [
          { id: 1, name: 'Games', date: '6/7/2020', type: 'File folder' },
          { id: 2, name: 'Program Files', date: '4/7/2021', type: 'File folder' },
          { id: 3, name: 'bootmgr', date: '11/20/2010', type: 'System file' },
          { id: 4, name: 'log.txt', date: '1/18/2016', type: 'Text Document' }
        ]
      };
    },
    sort({ items, sortDescriptor }: any) {
      return {
        items: items.sort((a: any, b: any) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }
          return cmp;
        })
      };
    }
  });

  return (
    <Table {...args} sortDescriptor={list.sortDescriptor} onSortChange={list.sort}>
      <TableHeader>
        <TableColumn key='name' allowsSorting>
          Name
        </TableColumn>
        <TableColumn key='type' allowsSorting>
          Type
        </TableColumn>
        <TableColumn key='date' allowsSorting>
          Date Modified
        </TableColumn>
      </TableHeader>
      <TableBody items={list.items}>
        {(item: any) => <TableRow key={item.name}>{(columnKey) => <TableCell>{item[columnKey]}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  );
};

const Sorting = SortingTemplate.bind({});
Sorting.args = {};

export { Default, Sorting };

export default {
  title: 'Components/NewTable',
  component: Table
} as Meta;
