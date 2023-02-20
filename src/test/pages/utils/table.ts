/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { screen, within } from '../../test-utils';

const getTable = (name: string | RegExp) => screen.getByRole('grid', { name: new RegExp(name, 'i') });

const withinTable = (name: string | RegExp) => {
  const table = within(getTable(name));
  return within(table.getAllByRole('rowgroup')[1]);
};

export { getTable, withinTable };
