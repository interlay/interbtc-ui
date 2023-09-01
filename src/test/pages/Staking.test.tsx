import MatchMediaMock from 'jest-matchmedia-mock';

import App from '@/App';
import { STAKE_LOCK_TIME } from '@/config/relay-chains';
import { convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import { MOCK_API, MOCK_ESCROW, MOCK_SYSTEM } from '../mocks/@interlay/interbtc-api';
import { EXTRINSIC_DATA } from '../mocks/@interlay/interbtc-api/extrinsic';
import { DEFAULT_ACCOUNT_1 } from '../mocks/substrate/mocks';
import { render, screen, userEvent, waitFor, within } from '../test-utils';
import { waitForFeeEstimate, waitForTransactionExecute } from './utils/transaction';

const { STAKED_BALANCE, GOVERNANCE_AMOUNT } = MOCK_ESCROW.DATA;
const {
  getStakedBalance,
  createLock,
  increaseAmount,
  increaseUnlockHeight,
  getRewardEstimate,
  withdraw,
  withdrawRewards
} = MOCK_ESCROW.MODULE;
const { batchAll } = MOCK_API.MODULE;
const { getCurrentBlockNumber } = MOCK_SYSTEM.MODULE;

jest.mock('@/components/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return {
    Layout: MockedLayout
  };
});

const path = '/staking';

const ONE_WEEK = 1;

const ONE_WEEK_UNLOCK_HEIGHT = convertWeeksToBlockNumbers(ONE_WEEK) + STAKED_BALANCE.FULL.endBlock;

describe('Staking Page', () => {
  let matchMedia: MatchMediaMock;

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    matchMedia = new MatchMediaMock();

    getStakedBalance.mockResolvedValue(STAKED_BALANCE.FULL);
  });

  afterEach(() => {
    matchMedia.clear();
  });

  it('should be able to do initial stake', async () => {
    getStakedBalance.mockResolvedValue(STAKED_BALANCE.EMPTY);

    await render(<App />, { path });

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), GOVERNANCE_AMOUNT.FULL.VALUE);

    userEvent.type(screen.getByRole('textbox', { name: /lock time/i, exact: false }), ONE_WEEK.toString());

    await waitForFeeEstimate(createLock);

    const unlockHeight = convertWeeksToBlockNumbers(ONE_WEEK);

    expect(getRewardEstimate).toHaveBeenLastCalledWith(
      DEFAULT_ACCOUNT_1.address,
      GOVERNANCE_AMOUNT.FULL.MONETARY,
      unlockHeight
    );

    expect(screen.getByText('08/01/23')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /stake/i }));

    await waitForTransactionExecute(createLock);

    expect(createLock).toHaveBeenCalledWith(GOVERNANCE_AMOUNT.FULL.MONETARY, unlockHeight);
  });

  it('should be able to increase stake and lock time amount', async () => {
    await render(<App />, { path });

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), GOVERNANCE_AMOUNT.FULL.VALUE);

    userEvent.type(screen.getByRole('textbox', { name: /extended lock time/i, exact: false }), ONE_WEEK.toString());

    await waitForFeeEstimate(batchAll);

    userEvent.click(screen.getByRole('button', { name: /stake/i }));

    await waitForTransactionExecute(batchAll);

    expect(increaseAmount).toHaveBeenCalledWith(GOVERNANCE_AMOUNT.FULL.MONETARY);
    expect(increaseUnlockHeight).toHaveBeenCalledWith(ONE_WEEK_UNLOCK_HEIGHT);
    expect(batchAll).toHaveBeenCalledWith([EXTRINSIC_DATA.extrinsic, EXTRINSIC_DATA.extrinsic]);
  });

  it('should be able to increase stake amount when lock time is empty', async () => {
    await render(<App />, { path });

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), GOVERNANCE_AMOUNT.FULL.VALUE);

    await waitForFeeEstimate(increaseAmount);

    userEvent.click(screen.getByRole('button', { name: /stake/i }));

    await waitForTransactionExecute(increaseAmount);

    expect(increaseAmount).toHaveBeenCalledWith(GOVERNANCE_AMOUNT.FULL.MONETARY);
  });

  it('should be able to increase stake amount when lock time is 0', async () => {
    await render(<App />, { path });

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), GOVERNANCE_AMOUNT.FULL.VALUE);

    userEvent.type(screen.getByRole('textbox', { name: /extended lock time/i, exact: false }), '0');

    await waitForFeeEstimate(increaseAmount);

    userEvent.click(screen.getByRole('button', { name: /stake/i }));

    await waitForTransactionExecute(increaseAmount);

    expect(increaseAmount).toHaveBeenCalledWith(GOVERNANCE_AMOUNT.FULL.MONETARY);
  });

  it('should be able to increase stake lock time', async () => {
    await render(<App />, { path });

    userEvent.type(screen.getByRole('textbox', { name: /extended lock time/i, exact: false }), ONE_WEEK.toString());

    await waitForFeeEstimate(increaseUnlockHeight);

    userEvent.click(screen.getByRole('button', { name: /stake/i }));

    await waitForTransactionExecute(increaseUnlockHeight);

    expect(increaseUnlockHeight).toHaveBeenCalledWith(ONE_WEEK_UNLOCK_HEIGHT);
  });

  it('should be able to set lock time using list', async () => {
    getStakedBalance.mockResolvedValue(STAKED_BALANCE.EMPTY);

    await render(<App />, { path });

    const grid = within(screen.getByRole('grid', { name: /lock time/i, exact: false }));

    userEvent.click(grid.getByRole('gridcell', { name: /1 week/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /lock time/i, exact: false })).toHaveValue(ONE_WEEK.toString());
    });

    userEvent.click(grid.getByRole('gridcell', { name: /1 month/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /lock time/i, exact: false })).toHaveValue('4');
    });

    userEvent.click(grid.getByRole('gridcell', { name: /3 month/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /lock time/i, exact: false })).toHaveValue('13');
    });

    userEvent.click(grid.getByRole('gridcell', { name: /6 month/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /lock time/i, exact: false })).toHaveValue('26');
    });

    userEvent.click(grid.getByRole('gridcell', { name: /max/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /lock time/i, exact: false })).toHaveValue(
        STAKE_LOCK_TIME.MAX.toString()
      );
    });
  });

  it('should be able to withdraw stake', async () => {
    getCurrentBlockNumber.mockResolvedValue(STAKED_BALANCE.FULL.endBlock);

    await render(<App />, { path });

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), GOVERNANCE_AMOUNT.FULL.VALUE);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /withdraw/i }));

    await waitForFeeEstimate(withdraw);

    const dialog = within(screen.getByRole('dialog', { name: /withdraw/i, exact: false }));

    userEvent.click(dialog.getByRole('button', { name: /withdraw/i }));

    await waitForTransactionExecute(withdraw);
  });

  it('should be able to claim rewards', async () => {
    await render(<App />, { path });

    userEvent.click(screen.getByRole('button', { name: /claim/i }));

    await waitForFeeEstimate(withdrawRewards);

    const dialog = within(screen.getByRole('dialog', { name: /claim rewards/i }));

    userEvent.click(dialog.getByRole('button', { name: /claim/i }));

    await waitForTransactionExecute(withdrawRewards);
  });

  it('should not be able to extend lock time due to input being disable (account already maxed lock time)', async () => {
    getStakedBalance.mockResolvedValue(STAKED_BALANCE.FULL_LOCK_TIME);

    await render(<App />, { path });

    expect(screen.getByRole('textbox', { name: /extended lock time/i, exact: false })).toBeDisabled();

    expect(screen.getAllByLabelText(/max 0/i)).toHaveLength(2);

    const grid = within(screen.getByRole('grid', { name: /lock time/i, exact: false }));

    const rows = grid.getAllByRole('row');

    rows.forEach((row) => {
      expect(row).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('should not be able to extend lock time due to exceeding max', async () => {
    getStakedBalance.mockResolvedValue(STAKED_BALANCE.EMPTY);

    await render(<App />, { path });

    userEvent.type(
      screen.getByRole('textbox', { name: new RegExp(`max ${STAKE_LOCK_TIME.MAX}`, 'i'), exact: false }),
      (STAKE_LOCK_TIME.MAX + ONE_WEEK).toString()
    );

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), GOVERNANCE_AMOUNT.FULL.VALUE);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: new RegExp(`max ${STAKE_LOCK_TIME.MAX}`, 'i') })).toHaveErrorMessage(
        ''
      );
    });

    expect(createLock).not.toHaveBeenCalled();
  });
});
