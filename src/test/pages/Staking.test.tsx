import MatchMediaMock from 'jest-matchmedia-mock';

import App from '@/App';
import { convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import { MOCK_ESCROW } from '../mocks/@interlay/interbtc-api';
import { render, screen, userEvent } from '../test-utils';
import { waitForFeeEstimate, waitForTransactionExecute } from './utils/transaction';

const { STAKED_BALANCE, GOVERNANCE_AMOUNT } = MOCK_ESCROW.DATA;
const { getStakedBalance, createLock, increaseAmount, increaseUnlockHeight } = MOCK_ESCROW.MODULE;

jest.mock('@/components/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return {
    Layout: MockedLayout
  };
});

const path = '/staking';

const ONE_WEEK = 1;

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

    const unlockHeight = convertWeeksToBlockNumbers(ONE_WEEK) + STAKED_BALANCE.FULL.endBlock;

    expect(increaseUnlockHeight).toHaveBeenCalledWith(unlockHeight);
  });
});
