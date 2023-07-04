import { MOCK_TRANSACTION } from '@/test/mocks/@interlay/interbtc-api';

import { screen, userEvent, waitFor, waitForElementToBeRemoved, within } from '../../test-utils';

const { getFeeEstimate } = MOCK_TRANSACTION.MODULE;

const waitForFeeEstimate = (transactionFn: jest.Mock<any, any>): Promise<void> =>
  waitFor(() => {
    expect(getFeeEstimate).toHaveBeenCalledTimes(1);
    expect(transactionFn).toHaveBeenCalledTimes(1);
  });

const waitForTransactionExecute = (transactionFn: jest.Mock<any, any>): Promise<void> =>
  waitFor(() => {
    expect(transactionFn).toHaveBeenCalledTimes(2);
  });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getFeeTokenSelect = (withinEl: ReturnType<typeof within> = screen) =>
  withinEl.getByRole('button', { name: /fee token/i, exact: false });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const withinTransactionModal = async () => {
  // await waitFor(() => {
  //   expect(screen.getByRole('dialog', { name: /confirm transaction/i })).toBeInTheDocument();
  // });

  // await waitFor(() => {
  //   expect(screen.getByRole('dialog', { name: /transaction processing/i })).toBeInTheDocument();
  // });

  await waitFor(() => {
    expect(screen.getByRole('dialog', { name: /transaction successful/i })).toBeInTheDocument();
  });

  const modal = within(screen.getByRole('dialog', { name: /transaction successful/i }));

  userEvent.click(modal.getAllByRole('button', { name: /dismiss/i })[0]);

  await waitFor(() => {
    expect(screen.queryByRole('dialog', { name: /transaction successful/i })).not.toBeInTheDocument();
  });
};

export { getFeeTokenSelect, waitForFeeEstimate, waitForTransactionExecute, withinTransactionModal };
