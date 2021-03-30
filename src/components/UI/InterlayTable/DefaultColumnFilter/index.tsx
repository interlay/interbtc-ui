
// ray test touch <
// TODO: should type properly
function DefaultColumnFilter({
  column: {
    filterValue,
    preFilteredRows,
    setFilter
  }
}: any) {
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

export default DefaultColumnFilter;
// ray test touch >
