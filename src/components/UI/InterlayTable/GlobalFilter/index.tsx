
import * as React from 'react';
import { useAsyncDebounce } from 'react-table';
import clsx from 'clsx';

// TODO: not used for now
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
// TODO: should type properly
}: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  // TODO: should type properly
  const onChange = useAsyncDebounce((value: any) => {
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
