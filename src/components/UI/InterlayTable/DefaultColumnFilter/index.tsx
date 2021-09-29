/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// TODO: not used for now
const DefaultColumnFilter = ({
  column: {
    filterValue,
    preFilteredRows,
    setFilter
  },
  placeholder
}): JSX.Element => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={event => {
        setFilter(event.currentTarget.value || undefined); // Set undefined to remove the filter entirely
      }}
      onClick={event => {
        event.stopPropagation();
      }}
      placeholder={placeholder || `Search ${count} records...`} />
  );
};

export default DefaultColumnFilter;
