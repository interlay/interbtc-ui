
// TODO: not used for now
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const DefaultColumnFilter = ({
  column: {
    filterValue,
    preFilteredRows,
    setFilter
  },
  placeholder
// TODO: should type properly
}: any): JSX.Element => {
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
