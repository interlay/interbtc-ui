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

export { getFeeTokenSelect, waitForFeeEstimate, waitForTransactionExecute };
