
// ray test touch <
// TODO: should type properly
// @ts-nocheck
import * as React from 'react';
import { useAsyncDebounce } from 'react-table';

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

export default GlobalFilter;
// ray test touch >
