/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as React from 'react';
import { useAsyncDebounce } from 'react-table';
import clsx from 'clsx';

// TODO: not used for now
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:&nbsp;
      <input
        className={clsx('text-lg', 'border-0')}
        value={value || ''}
        onChange={(event) => {
          setValue(event.target.value);
          onChange(event.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
}

export default GlobalFilter;
