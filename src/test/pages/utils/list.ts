/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { screen, userEvent, waitFor, waitForElementToBeRemoved, within } from '../../test-utils';
import { composeName, ElementName } from './common';

const getList = (name: ElementName) => screen.getByRole('grid', { name: composeName(name) });

const withinList = (name: ElementName) => within(getList(name));

const getListRow = (listName: ElementName, rowName: ElementName) => {
  const table = withinList(listName);

  return table.getByRole('row', { name: composeName(rowName) });
};

const withinListRow = (listName: string, asset: string) => within(getListRow(listName, asset));

export { getList, getListRow, withinList, withinListRow };
