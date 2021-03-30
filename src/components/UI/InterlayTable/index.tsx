// @ts-nocheck
import * as React from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table';
import clsx from 'clsx';

const TableContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'overflow-scroll',
      className
    )}
    {...rest} />
);

const Table = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'table'>) => (
  <table
    className={clsx(
      'w-full',
      className
    )}
    {...rest} />
);

const Thead = (props: React.ComponentPropsWithRef<'thead'>) => (
  <thead {...props} />
);

const Tbody = (props: React.ComponentPropsWithRef<'tbody'>) => (
  <tbody {...props} />
);

const Tr = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'tr'>) => (
  <tr
    className={clsx(
      'border-b',
      'border-l-0',
      'border-r-0',
      'border-t-0',
      'border-solid',
      'border-gray-300', // TODO: should update per design
      'text-sm',
      className
    )}
    {...rest} />
);

const Th = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'th'>) => (
  <th
    className={clsx(
      'text-secondary',
      'text-base',
      'p-2',
      className
    )}
    {...rest} />
);

const Td = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'th'>) => (
  <td
    className={clsx(
      'h-12',
      'p-2',
      className
    )}
    {...rest} />
);

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={event => {
          setValue(event.target.value);
          onChange(event.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0'
        }} />
    </span>
  );
}

function DefaultColumnFilter({
  column: {
    filterValue,
    preFilteredRows,
    setFilter
  }
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={event => {
        setFilter(event.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      onClick={event => {
        event.stopPropagation();
      }}
      placeholder={`Search ${count} records...`} />
  );
}

// TODO: should type properly (Re:https://github.com/tannerlinsley/react-table/blob/master/TYPESCRIPT.md)
const InterlayTable = ({
  className,
  columns,
  data
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  return (
    <TableContainer>
      <Table
        {...getTableProps()}>
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted && (
                    <span className='ml-1'>
                      {column.isSortedDesc ? '▼' : '▲'}
                    </span>
                  )}
                  {column.canFilter && <div>{column.render('Filter')}</div>}
                </Th>
              ))}
            </Tr>
          ))}
          <Tr>
            <Th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left'
              }}>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter} />
            </Th>
          </Tr>
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);

            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default InterlayTable;
