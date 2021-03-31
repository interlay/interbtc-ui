
// TODO: should type properly
// @ts-nocheck
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
        setFilter(event.currentTarget.value || undefined); // Set undefined to remove the filter entirely
      }}
      onClick={event => {
        event.stopPropagation();
      }}
      placeholder={`Search ${count} records...`} />
  );
}

export default DefaultColumnFilter;
