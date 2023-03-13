import '@testing-library/jest-dom';

import App from '@/App';
import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_POSITIONS,
  mockDisableAsCollateral,
  mockEnableAsCollateral,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitForElementToBeRemoved, within } from '../../test-utils';
import { withinTableRow } from '../utils/loans';
import { TABLES } from './constants';

const path = '/lending';

const withinCollateralModal = (asset = 'IBTC') => {
  const row = withinTableRow(TABLES.LEND.POSITION, asset);

  userEvent.click(row.getByRole('switch', { name: `toggle ${asset} collateral` }));

  return within(screen.getByRole('dialog'));
};

describe('Collateral Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it('should be able to enable collateral when there is no collateral', async () => {
    mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);

    await render(<App />, { path });

    const modal = withinCollateralModal();

    userEvent.click(modal.getByRole('button', { name: /use IBTC as collateral/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockEnableAsCollateral).toHaveBeenCalledTimes(1);
    expect(mockEnableAsCollateral).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should be able to enable collateral when there is already collateral', async () => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue([
      DEFAULT_POSITIONS.LEND.IBTC,
      { ...DEFAULT_POSITIONS.LEND.INTR, isCollateral: false }
    ]);

    await render(<App />, { path });

    const modal2 = withinCollateralModal('INTR');

    userEvent.click(modal2.getByRole('button', { name: /use INTR as collateral/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockEnableAsCollateral).toHaveBeenCalledTimes(1);
    expect(mockEnableAsCollateral).toHaveBeenCalledWith(GOVERNANCE_TOKEN);
  });

  it('should be able to disable collateral when there are no borrow positions', async () => {
    mockGetBorrowPositionsOfAccount.mockReturnValue([]);

    await render(<App />, { path });

    const modal = withinCollateralModal();

    userEvent.click(modal.getByRole('button', { name: /disable IBTC/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockDisableAsCollateral).toHaveBeenCalledTimes(1);
    expect(mockDisableAsCollateral).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should be able to disable collateral when there are open borrow positions', async () => {
    mockGetBorrowPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.BORROW.INTR]);
    mockGetLendPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.LEND.IBTC, DEFAULT_POSITIONS.LEND.INTR]);

    await render(<App />, { path });

    const modal2 = withinCollateralModal('INTR');

    userEvent.click(modal2.getByRole('button', { name: /disable INTR/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockDisableAsCollateral).toHaveBeenCalledTimes(1);
    expect(mockDisableAsCollateral).toHaveBeenCalledWith(GOVERNANCE_TOKEN);
  });

  it('should not be able to disable collateral due to low collateral while having only one asset as collateral', async () => {
    mockGetLendPositionsOfAccount.mockReturnValue([
      DEFAULT_POSITIONS.LEND.IBTC,
      { ...DEFAULT_POSITIONS.LEND.INTR, isCollateral: false }
    ]);

    await render(<App />, { path });

    const modal = withinCollateralModal();

    userEvent.click(modal.getAllByRole('button', { name: /dismiss/i })[1]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockEnableAsCollateral).not.toHaveBeenCalled();
    expect(mockDisableAsCollateral).not.toHaveBeenCalled();
  });

  it('should not be able to disable collateral due to low collateral while having two asset as collateral', async () => {
    mockGetBorrowPositionsOfAccount.mockReturnValue([
      { ...DEFAULT_POSITIONS.BORROW.IBTC, amount: DEFAULT_IBTC.MONETARY.MEDIUM }
    ]);

    await render(<App />, { path });

    const modal2 = withinCollateralModal();

    userEvent.click(modal2.getAllByRole('button', { name: /dismiss/i })[1]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockEnableAsCollateral).not.toHaveBeenCalled();
    expect(mockDisableAsCollateral).not.toHaveBeenCalled();
  });
});
