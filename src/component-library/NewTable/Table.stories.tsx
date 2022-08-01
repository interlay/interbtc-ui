import { useAsyncList } from '@react-stately/data';
import { Meta, Story } from '@storybook/react';

import { Cell, Column, Row, Table, TableBody, TableHeader } from '.';

const Template: Story<any> = (args) => {
  return (
    <Table {...args} aria-label='Example static collection table' style={{ height: '210px', maxWidth: '400px' }}>
      <TableHeader>
        <Column key='name' allowsSorting>
          Name
        </Column>
        <Column>Type</Column>
        <Column>Date Modified</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>Games</Cell>
          <Cell>File folder</Cell>
          <Cell>6/7/2020</Cell>
        </Row>
        <Row>
          <Cell>Program Files</Cell>
          <Cell>File folder</Cell>
          <Cell>4/7/2021</Cell>
        </Row>
        <Row>
          <Cell>bootmgr</Cell>
          <Cell>System file</Cell>
          <Cell>11/20/2010</Cell>
        </Row>
        <Row>
          <Cell>log.txt</Cell>
          <Cell>Text Document</Cell>
          <Cell>1/18/2016</Cell>
        </Row>
      </TableBody>
    </Table>
  );
};

const Default = Template.bind({});
Default.args = {};

const SortingTemplate: Story<any> = () => {
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
    <Table
      aria-label='Example table with client side sorting'
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    >
      <TableHeader>
        <Column key='name' allowsSorting>
          Name
        </Column>
        <Column key='type' allowsSorting>
          Type
        </Column>
        <Column key='date' allowsSorting>
          Date Modified
        </Column>
      </TableHeader>
      <TableBody items={list.items}>
        {(item) => <Row key={item.name}>{(columnKey) => <Cell>{item[columnKey]}</Cell>}</Row>}
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
