
import * as React from 'react';
import clsx from 'clsx';

// TODO: not used for now
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function NumberRangeColumnFilter({
  column: {
    filterValue = [],
    preFilteredRows,
    setFilter,
    id
  }
// TODO: should type properly
}: any) {
  const [
    min,
    max
  ] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });

    return [
      min,
      max
    ];
  }, [
    id,
    preFilteredRows
  ]);

  return (
    <div
      className={clsx(
        'flex',
        'space-x-4',
        'items-center'
      )}>
      <input
        className='w-20'
        value={filterValue[0] || ''}
        type='number'
        onChange={event => {
          const value = event.currentTarget.value;
          setFilter((old = []) => [value ? parseInt(value, 10) : undefined, old[1]]);
        }}
        onClick={event => {
          event.stopPropagation();
        }}
        placeholder={`Min (${min})`} />
      <span>to</span>
      <input
        className='w-20'
        value={filterValue[1] || ''}
        type='number'
        onChange={event => {
          const value = event.currentTarget.value;
          setFilter((old = []) => [old[0], value ? parseInt(value, 10) : undefined]);
        }}
        onClick={event => {
          event.stopPropagation();
        }}
        placeholder={`Max (${max})`} />
    </div>
  );
}

export default NumberRangeColumnFilter;
