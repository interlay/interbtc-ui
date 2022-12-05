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
import { TABLES } from './constants';
import { withinTableRow } from './utils';

jest.mock('../../../parts/Layout', () => {
  return ({ children }: any) => children;
});

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

  describe('Without Borrow Positions', () => {
    beforeEach(() => {
      mockGetBorrowPositionsOfAccount.mockReturnValue([]);
    });

    it('should be able to enable first asset', async () => {
      mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);

      await render(<App />, { path });

      const modal = withinCollateralModal();

      userEvent.click(modal.getByRole('button', { name: /use IBTC as collateral/i }));

      await waitForElementToBeRemoved(screen.getByRole('dialog'));

      expect(mockEnableAsCollateral).toHaveBeenCalledTimes(1);
      expect(mockEnableAsCollateral).toHaveBeenCalledWith(WRAPPED_TOKEN);
    });

    it('should be able to disable first asset', async () => {
      mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);

      await render(<App />, { path });

      const modal = withinCollateralModal();

      userEvent.click(modal.getByRole('button', { name: /disable IBTC/i }));

      await waitForElementToBeRemoved(screen.getByRole('dialog'));

      expect(mockDisableAsCollateral).toHaveBeenCalledTimes(1);
      expect(mockDisableAsCollateral).toHaveBeenCalledWith(WRAPPED_TOKEN);
    });
  });

  describe('With Borrow Positions', () => {
    beforeEach(() => {
      mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    });

    describe('With one asset as collateral', () => {
      beforeEach(() => {
        mockGetLendPositionsOfAccount.mockReturnValue([
          DEFAULT_POSITIONS.LEND.IBTC,
          { ...DEFAULT_POSITIONS.LEND.INTR, isCollateral: false }
        ]);
      });

      it('should not be able to disable asset', async () => {
        await render(<App />, { path });

        const modal = withinCollateralModal();

        userEvent.click(modal.getAllByRole('button', { name: /dismiss/i })[1]);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(mockEnableAsCollateral).not.toHaveBeenCalled();
        expect(mockDisableAsCollateral).not.toHaveBeenCalled();
      });

      it('should be able to enable another asset', async () => {
        await render(<App />, { path });

        const modal = withinCollateralModal('INTR');

        userEvent.click(modal.getByRole('button', { name: /use INTR as collateral/i }));

        await waitForElementToBeRemoved(screen.getByRole('dialog'));

        expect(mockEnableAsCollateral).toHaveBeenCalledTimes(1);
        expect(mockEnableAsCollateral).toHaveBeenCalledWith(GOVERNANCE_TOKEN);
      });
    });

    describe('With two assets as collateral', () => {
      beforeEach(() => {
        mockGetLendPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.LEND.IBTC, DEFAULT_POSITIONS.LEND.INTR]);
      });

      it('should be able to disable one asset', async () => {
        mockGetBorrowPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.BORROW.INTR]);

        await render(<App />, { path });

        const modal = withinCollateralModal('INTR');

        userEvent.click(modal.getByRole('button', { name: /disable INTR/i }));

        await waitForElementToBeRemoved(screen.getByRole('dialog'));

        expect(mockDisableAsCollateral).toHaveBeenCalledTimes(1);
        expect(mockDisableAsCollateral).toHaveBeenCalledWith(GOVERNANCE_TOKEN);
      });

      it('should not be able to disable one asset', async () => {
        mockGetBorrowPositionsOfAccount.mockReturnValue([
          { ...DEFAULT_POSITIONS.BORROW.IBTC, amount: DEFAULT_IBTC.MONETARY.MEDIUM }
        ]);

        await render(<App />, { path });

        const modal = withinCollateralModal();

        userEvent.click(modal.getAllByRole('button', { name: /dismiss/i })[1]);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(mockEnableAsCollateral).not.toHaveBeenCalled();
        expect(mockDisableAsCollateral).not.toHaveBeenCalled();
      });
    });
  });
});
