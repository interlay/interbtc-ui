// @ts-nocheck
import {
  useState,
  useMemo
} from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table';
import clsx from 'clsx';

import styles from './interlay-table.module.css';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
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
  const defaultColumn = useMemo(
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
    <div
      className={clsx(
        'overflow-scroll',
        className
      )}>
      <table
        className={styles['interlay-table']}
        {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted && (
                    <span className='ml-1'>
                      {column.isSortedDesc ? '▼' : '▲'}
                    </span>
                  )}
                  {column.canFilter && <div>{column.render('Filter')}</div>}
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left'
              }}>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter} />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InterlayTable;
