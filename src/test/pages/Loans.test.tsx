import '@testing-library/jest-dom';

import App from '@/App';

import {
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount,
  mockPositions
} from '../mocks/@interlay/interbtc-api/parachain/loans';
import { render, screen, userEvent, within } from '../test-utils';

const path = '/lending';

describe('Loans page', () => {
  it('should render with lend and borrow assets', async () => {
    await render(<App />, { path });

    expect(screen.getByRole('heading', { level: 1, name: /interlend/i })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: /lend/i })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: /borrow/i })).toBeInTheDocument();
    expect(screen.queryByRole('grid', { name: /my lend positions/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('grid', { name: /my borrow positions/i })).not.toBeInTheDocument();
  });

  it.each([/lend/i, /withdraw/i])('should be able to %s', async (loanType) => {
    await render(<App />, { path });

    const lendTable = within(screen.getByRole('grid', { name: /lend/i }));

    userEvent.click(lendTable.getByRole('row', { name: /kbtc/i }));

    const modal = within(screen.getByRole('dialog'));

    const tablist = within(modal.getByRole('tablist'));

    userEvent.click(tablist.getByRole('tab', { name: loanType }));

    expect(modal.getByRole('heading', { name: loanType })).toBeInTheDocument();

    userEvent.type(modal.getByRole('textbox', { name: loanType, exact: false }), '1');

    userEvent.click(modal.getByRole('button', { name: loanType }));

    // TODO: add expect when lend mutation is added
  });

  it.each([/borrow/i, /repay/i])('should be able to %s', async (loanType) => {
    await render(<App />, { path });

    const borrowTable = within(screen.getByRole('grid', { name: /borrow/i }));

    userEvent.click(borrowTable.getByRole('row', { name: /kbtc/i }));

    const modal = within(screen.getByRole('dialog'));

    const tablist = within(modal.getByRole('tablist'));

    userEvent.click(tablist.getByRole('tab', { name: loanType }));

    expect(modal.getByRole('heading', { name: loanType })).toBeInTheDocument();

    userEvent.type(modal.getByRole('textbox', { name: loanType, exact: false }), '1');

    userEvent.click(modal.getByRole('button', { name: loanType }));

    // TODO: add expect when borrow mutation is added
  });

  it('should render lend positions', async () => {
    mockGetLendPositionsOfAccount.mockReturnValueOnce(mockPositions);

    await render(<App />, { path });

    const lendPositionsTable = within(screen.getByRole('grid', { name: /my lend positions/i }));

    userEvent.click(lendPositionsTable.getByRole('row', { name: /kbtc/i }));

    const modal = within(screen.getByRole('dialog'));

    expect(modal.getByRole('heading', { name: /lend/i })).toBeInTheDocument();
  });

  it('should render borrow positions', async () => {
    mockGetBorrowPositionsOfAccount.mockReturnValueOnce(mockPositions);

    await render(<App />, { path });

    const borrowPositionsTable = within(screen.getByRole('grid', { name: /my borrow positions/i }));

    userEvent.click(borrowPositionsTable.getByRole('row', { name: /kbtc/i }));

    const modal = within(screen.getByRole('dialog'));

    expect(modal.getByRole('heading', { name: /borrow/i })).toBeInTheDocument();
  });
});
