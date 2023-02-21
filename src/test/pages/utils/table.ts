/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { screen, userEvent, within } from '../../test-utils';

type ElementName = string | RegExp;

const composeName = (name: ElementName) => (typeof name === 'string' ? new RegExp(name, 'i') : name);

const getTable = (name: ElementName) => screen.getByRole('grid', { name: composeName(name) });

const withinTable = (name: ElementName) => {
  const table = within(getTable(name));
  return within(table.getAllByRole('rowgroup')[1]);
};

const getTableRow = (tableName: ElementName, rowName: ElementName) => {
  const table = withinTable(tableName);

  return table.getByRole('row', { name: composeName(rowName) });
};

const getTableModal = (tableName: ElementName, rowName: ElementName) => {
  const row = getTableRow(tableName, rowName);

  userEvent.click(row);

  return screen.getByRole('dialog');
};

const withinTableModal = (tableName: ElementName, rowName: ElementName) => within(getTableModal(tableName, rowName));

const getModalTabPanel = (
  tableName: ElementName,
  rowName: ElementName,
  tabName: ElementName,
  shouldClickTab?: boolean
) => {
  const modal = withinTableModal(tableName, rowName);

  if (shouldClickTab) {
    userEvent.click(
      modal.getByRole('tab', {
        name: new RegExp(tabName, 'i')
      })
    );
  }

  return modal.getByRole('tabpanel', {
    name: new RegExp(tabName, 'i')
  });
};

const withinModalTabPanel = (
  tableName: ElementName,
  rowName: ElementName,
  tabName: ElementName,
  shouldClickTab?: boolean
) => within(getModalTabPanel(tableName, rowName, tabName, shouldClickTab));

export { getTable, withinModalTabPanel, withinTable };
