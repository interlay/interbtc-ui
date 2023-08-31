import MatchMediaMock from 'jest-matchmedia-mock';

import App from '@/App';
import { STAKE_LOCK_TIME } from '@/config/relay-chains';
import { convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import { MOCK_API, MOCK_ESCROW } from '../mocks/@interlay/interbtc-api';
import { EXTRINSIC_DATA } from '../mocks/@interlay/interbtc-api/extrinsic';
import { render, screen, userEvent, waitFor, within } from '../test-utils';
import { waitForFeeEstimate, waitForTransactionExecute } from './utils/transaction';

const { STAKED_BALANCE, GOVERNANCE_AMOUNT } = MOCK_ESCROW.DATA;
const { getStakedBalance, createLock, increaseAmount, increaseUnlockHeight } = MOCK_ESCROW.MODULE;
const { batchAll } = MOCK_API.MODULE;

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

describe('Pools Page', () => {
  let matchMedia: MatchMediaMock;

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

    userEvent.click(screen.getByRole('button', { name: /stake/i }));

    await waitForTransactionExecute(createLock);

    const unlockHeight = convertWeeksToBlockNumbers(ONE_WEEK);

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

  it('should be able to increase stake amount', async () => {
    await render(<App />, { path });

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), GOVERNANCE_AMOUNT.FULL.VALUE);

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

    const grid = within(screen.getByRole('grid', { name: /staking lock time/i }));

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
});
