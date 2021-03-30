
// ray test touch <
import * as React from 'react';

// TODO: should type properly
function NumberRangeColumnFilter({
  column: {
    filterValue = [],
    preFilteredRows,
    setFilter,
    id
  }
}: any) {
  const [
    min,
    max
  ] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
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
      style={{
        display: 'flex'
      }}>
      <input
        value={filterValue[0] || ''}
        type='number'
        onChange={event => {
          const val = event.target.value;
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
        }}
        onClick={event => {
          event.stopPropagation();
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem'
        }} />
      to
      <input
        value={filterValue[1] || ''}
        type='number'
        onChange={event => {
          const val = event.target.value;
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
        }}
        onClick={event => {
          event.stopPropagation();
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem'
        }} />
    </div>
  );
}

export default NumberRangeColumnFilter;
// ray test touch >
