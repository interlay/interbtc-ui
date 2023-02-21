/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { screen, within } from '../../test-utils';

const getTable = (name: string | RegExp) =>
  screen.getByRole('grid', { name: typeof name === 'string' ? new RegExp(name, 'i') : name });

const withinTable = (name: string | RegExp) => {
  const table = within(getTable(name));
  return within(table.getAllByRole('rowgroup')[1]);
};

export { getTable, withinTable };
