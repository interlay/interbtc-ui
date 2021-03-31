
// TODO: should type properly
// @ts-nocheck
import * as React from 'react';
import { useAsyncDebounce } from 'react-table';
import clsx from 'clsx';

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
      Search:&nbsp;
      <input
        className={clsx(
          'text-lg',
          'border-0'
        )}
        value={value || ''}
        onChange={event => {
          setValue(event.target.value);
          onChange(event.target.value);
        }}
        placeholder={`${count} records...`} />
    </span>
  );
}

export default GlobalFilter;
