import '@testing-library/jest-dom';

import App from '@/App';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api';

import { render, screen, userEvent, waitForElementToBeRemoved, within } from '../../test-utils';
import { withinTableRow } from '../utils/table';
import { waitForFeeEstimate, waitForTransactionExecute } from '../utils/transaction';
import { TABLES } from './constants';

const {
  getBorrowPositionsOfAccount,
  getLendPositionsOfAccount,
  getLoanAssets,
  getLendingStats,
  enableAsCollateral,
  disableAsCollateral
} = MOCK_LOANS.MODULE;
const { LOAN_POSITIONS, ASSETS, LENDING_STATS, WRAPPED_LOAN, GOVERNANCE_LOAN } = MOCK_LOANS.DATA;

const path = '/lending';

const withinCollateralModal = (asset: string, modalTitle?: RegExp) => {
  const row = withinTableRow(TABLES.LEND.POSITION, asset);

  userEvent.click(row.getByRole('switch', { name: `toggle ${asset} collateral` }));

  return within(screen.getByRole('dialog', { name: modalTitle }));
};

describe.skip('Collateral Flow', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.EMPTY);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE);
    getLoanAssets.mockReturnValue(ASSETS.NORMAL);
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_LTV);
  });

  it('should be able to enable collateral when there is no collateral', async () => {
    await render(<App />, { path });

    const modal = withinCollateralModal(WRAPPED_LOAN.ASSET.currency.ticker, /enable as collateral/i);

    await waitForFeeEstimate(enableAsCollateral);

    userEvent.click(
      modal.getByRole('button', { name: new RegExp(`use ${WRAPPED_LOAN.ASSET.currency.ticker} as collateral`, 'i') })
    );

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    await waitForTransactionExecute(enableAsCollateral);

    expect(enableAsCollateral).toHaveBeenCalledWith(WRAPPED_LOAN.ASSET.currency);
  });

  it('should be able to disable collateral when there are no borrow positions', async () => {
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE_COLLATERAL);

    await render(<App />, { path });

    const modal = withinCollateralModal(WRAPPED_LOAN.ASSET.currency.ticker, /disable collateral/i);

    await waitForFeeEstimate(disableAsCollateral);

    userEvent.click(
      modal.getByRole('button', { name: new RegExp(`disable ${WRAPPED_LOAN.ASSET.currency.ticker}`, 'i') })
    );

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    await waitForTransactionExecute(disableAsCollateral);

    expect(disableAsCollateral).toHaveBeenCalledWith(WRAPPED_LOAN.ASSET.currency);
  });

  it('should be able to disable collateral when there are open borrow positions', async () => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.AVERAGE);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.FULL_COLLATERAL);

    await render(<App />, { path });

    const modal = withinCollateralModal(GOVERNANCE_LOAN.ASSET.currency.ticker, /disable collateral/i);

    await waitForFeeEstimate(disableAsCollateral);

    userEvent.click(
      modal.getByRole('button', { name: new RegExp(`disable ${GOVERNANCE_LOAN.ASSET.currency.ticker}`, 'i') })
    );

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    await waitForTransactionExecute(disableAsCollateral);

    expect(disableAsCollateral).toHaveBeenCalledWith(GOVERNANCE_LOAN.ASSET.currency);
  });

  it('should not be able to disable collateral due to low collateral while having only one asset as collateral', async () => {
    getLendingStats.mockReturnValue(LENDING_STATS.LIQUIDATION);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE_COLLATERAL);

    await render(<App />, { path });

    const modal = withinCollateralModal(WRAPPED_LOAN.ASSET.currency.ticker, /collateral required/i);

    userEvent.click(modal.getAllByRole('button', { name: /dismiss/i })[1]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(disableAsCollateral).not.toHaveBeenCalled();
  });

  it('should not be able to disable collateral due to qTokens being used as vault collateral', async () => {
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.FULL_VAULT_COLLATERAL);

    await render(<App />, { path });

    const modal = withinCollateralModal(WRAPPED_LOAN.ASSET.currency.ticker, /already used as vault collateral/i);

    userEvent.click(modal.getAllByRole('button', { name: /dismiss/i })[1]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(disableAsCollateral).not.toHaveBeenCalled();
  });
});
