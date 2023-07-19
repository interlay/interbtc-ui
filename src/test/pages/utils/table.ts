/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { screen, userEvent, waitFor, waitForElementToBeRemoved, within } from '../../test-utils';
import { composeName, ElementName } from './common';

const getTable = (name: ElementName) => screen.getByRole('grid', { name: composeName(name) });

const queryTable = (name: ElementName) => screen.queryByRole('grid', { name: composeName(name) });

const withinTable = (name: ElementName) => {
  const table = within(getTable(name));
  return within(table.getAllByRole('rowgroup')[1]);
};

const getTableRow = (tableName: ElementName, rowName: ElementName) => {
  const table = withinTable(tableName);

  return table.getByRole('row', { name: composeName(rowName) });
};

const withinTableRow = (tableName: string, asset: string) => within(getTableRow(tableName, asset));

const getTableModal = async (tableName: ElementName, rowName: ElementName) => {
  const row = getTableRow(tableName, rowName);

  userEvent.click(row);

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  return screen.getByRole('dialog');
};

const withinTableModal = async (tableName: ElementName, rowName: ElementName) =>
  within(await getTableModal(tableName, rowName));

const getModalTabPanel = async (
  tableName: ElementName,
  rowName: ElementName,
  tabName: ElementName,
  shouldClickTab?: boolean
) => {
  const modal = await withinTableModal(tableName, rowName);

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

const withinModalTabPanel = async (
  tableName: ElementName,
  rowName: ElementName,
  tabName: ElementName,
  shouldClickTab?: boolean
) => within(await getModalTabPanel(tableName, rowName, tabName, shouldClickTab));

const submitForm = async (tabPanel: ReturnType<typeof within>, buttonLabel: string) => {
  await waitFor(() => {
    expect(tabPanel.getByRole('button', { name: new RegExp(buttonLabel, 'i') })).not.toBeDisabled();
  });

  userEvent.click(tabPanel.getByRole('button', { name: new RegExp(buttonLabel, 'i') }));

  await waitForElementToBeRemoved(screen.getByRole('dialog'));
};

export { getTable, getTableRow, queryTable, submitForm, withinModalTabPanel, withinTable, withinTableRow };
