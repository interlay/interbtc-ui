/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { screen, userEvent, within } from '../../test-utils';

const withinTable = (name: string) => {
  const table = within(screen.getByRole('grid', { name: new RegExp(name, 'i') }));
  return within(table.getAllByRole('rowgroup')[1]);
};

const getTableRow = (tableName: string, asset: string) => {
  const table = withinTable(tableName);

  return table.getByRole('row', { name: new RegExp(`${asset} ${asset}`, 'i') });
};

const withinTableRow = (tableName: string, asset: string) => within(getTableRow(tableName, asset));

const getTableModal = (tableName: string, asset: string) => {
  const row = getTableRow(tableName, asset);

  userEvent.click(row);

  return screen.getByRole('dialog');
};

const withinTableModal = (tableName: string, asset: string) => within(getTableModal(tableName, asset));

const getModalTabPanel = (tableName: string, tabName: string, asset: string, shouldClickTab?: boolean) => {
  const modal = withinTableModal(tableName, asset);

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

const withinModalTabPanel = (tableName: string, tabName: string, asset: string, shouldClickTab?: boolean) =>
  within(getModalTabPanel(tableName, tabName, asset, shouldClickTab));

export {
  getModalTabPanel,
  getTableModal,
  getTableRow,
  withinModalTabPanel,
  withinTable,
  withinTableModal,
  withinTableRow
};
