import { newMonetaryAmount } from '@interlay/interbtc-api';

import App from '@/App';

import { DEFAULT_DEADLINE_BLOCK_NUMBER, mockGetFutureBlockNumber } from '../mocks/@interlay/interbtc-api';
import {
  ACCOUNT_WITH_FULL_LIQUIDITY,
  ACCOUNT_WITH_SOME_LIQUIDITY,
  DEFAULT_ACCOUNT_LIQUIDITY,
  DEFAULT_CLAIMABLE_REWARDS,
  DEFAULT_LIQUIDITY_POOL_1,
  DEFAULT_LIQUIDITY_POOL_2,
  DEFAULT_LP_TOKEN_1,
  DEFAULT_LP_TOKEN_2,
  DEFAULT_POOLED_CURRENCIES_1,
  mockAddLiquidity,
  mockClaimFarmingRewards,
  mockGetClaimableFarmingRewards,
  mockGetLiquidityProvidedByAccount,
  mockRemoveLiquidity
} from '../mocks/@interlay/interbtc-api/parachain/amm';
import { DEFAULT_ACCOUNT_ADDRESS } from '../mocks/substrate/mocks';
import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '../test-utils';
import { withinModalTabPanel, withinTable } from './utils/table';

const path = '/pools';

const TABLES = {
  ACCOUNT_POOLS: 'my pools',
  AVAILABLE_POOLS: 'other pools'
};

const TABS = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw'
};

// MEMO: skipped including testing slippage
describe.skip('Pools Page', () => {
  beforeEach(() => {
    mockGetLiquidityProvidedByAccount.mockResolvedValue(DEFAULT_ACCOUNT_LIQUIDITY);
  });

  it('should only render available pools', async () => {
    await render(<App />, { path });

    const otherPoolsTable = withinTable(TABLES.AVAILABLE_POOLS);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(2);
    expect(otherPoolsTable.getByRole('row', { name: DEFAULT_LP_TOKEN_1.ticker })).toBeInTheDocument();
    expect(otherPoolsTable.getByRole('row', { name: DEFAULT_LP_TOKEN_2.ticker })).toBeInTheDocument();

    expect(screen.queryByRole('grid', { name: new RegExp(TABLES.ACCOUNT_POOLS, 'i') })).not.toBeInTheDocument();
  });

  it('should render both available and account pools', async () => {
    mockGetLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_WITH_SOME_LIQUIDITY);

    await render(<App />, { path });

    const otherPoolsTable = withinTable(TABLES.AVAILABLE_POOLS);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(1);
    expect(otherPoolsTable.getByRole('row', { name: DEFAULT_LP_TOKEN_1.ticker })).toBeInTheDocument();

    const myPoolsTable = withinTable(TABLES.ACCOUNT_POOLS);

    expect(myPoolsTable.getAllByRole('row')).toHaveLength(1);
    expect(myPoolsTable.getByRole('row', { name: DEFAULT_LP_TOKEN_2.ticker })).toBeInTheDocument();
  });

  it('should render account pools', async () => {
    mockGetLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_WITH_FULL_LIQUIDITY);

    await render(<App />, { path });

    expect(screen.queryByRole('grid', { name: new RegExp(TABLES.AVAILABLE_POOLS, 'i') })).not.toBeInTheDocument();

    const myPoolsTable = withinTable(TABLES.ACCOUNT_POOLS);

    expect(myPoolsTable.getAllByRole('row')).toHaveLength(2);
  });

  it('should be able to deposit', async () => {
    jest
      .spyOn(DEFAULT_LIQUIDITY_POOL_1, 'getLiquidityDepositInputAmounts')
      .mockReturnValue(DEFAULT_POOLED_CURRENCIES_1);

    const [DEFAULT_CURRENCY_1, DEFAULT_CURRENCY_2] = DEFAULT_POOLED_CURRENCIES_1;

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.AVAILABLE_POOLS, DEFAULT_LP_TOKEN_1.ticker, TABS.DEPOSIT);

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: new RegExp(`${DEFAULT_CURRENCY_1.currency.ticker} deposit amount`, 'i')
      }),
      DEFAULT_CURRENCY_1.toString(),
      { delay: 1 }
    );

    expect(DEFAULT_LIQUIDITY_POOL_1.getLiquidityDepositInputAmounts).toHaveBeenCalledWith(DEFAULT_CURRENCY_1);

    await waitFor(() => {
      expect(
        tabPanel.getByRole('textbox', {
          name: new RegExp(`${DEFAULT_CURRENCY_2.currency.ticker} deposit amount`, 'i')
        })
      ).toHaveValue(DEFAULT_CURRENCY_2.toString());
    });

    userEvent.click(tabPanel.getByRole('button', { name: /add liquidity/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockGetFutureBlockNumber).toHaveBeenCalledTimes(1);
    expect(mockAddLiquidity).toHaveBeenCalledWith(
      DEFAULT_POOLED_CURRENCIES_1,
      DEFAULT_LIQUIDITY_POOL_1,
      0.1,
      DEFAULT_DEADLINE_BLOCK_NUMBER,
      DEFAULT_ACCOUNT_ADDRESS
    );
  });

  it('should be able to withdraw', async () => {
    mockGetLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_WITH_SOME_LIQUIDITY);

    const LP_TOKEN_INPUT = newMonetaryAmount(0.1, DEFAULT_LP_TOKEN_2, true);

    jest.spyOn(DEFAULT_LIQUIDITY_POOL_2, 'getLiquidityWithdrawalPooledCurrencyAmounts').mockReturnValue([]);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.ACCOUNT_POOLS, DEFAULT_LP_TOKEN_2.ticker, TABS.WITHDRAW, true);

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: /withdraw amount/i
      }),
      LP_TOKEN_INPUT.toString(),
      { delay: 1 }
    );

    await waitFor(() => {
      expect(tabPanel.getByRole('button', { name: /remove liquidity/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel.getByRole('button', { name: /remove liquidity/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockGetFutureBlockNumber).toHaveBeenCalledTimes(1);
    expect(mockRemoveLiquidity).toHaveBeenCalledWith(
      LP_TOKEN_INPUT,
      DEFAULT_LIQUIDITY_POOL_2,
      0.1,
      DEFAULT_DEADLINE_BLOCK_NUMBER,
      DEFAULT_ACCOUNT_ADDRESS
    );
  });

  it('should be able to claim rewards', async () => {
    let app = await render(<App />, { path });

    userEvent.click(screen.getByRole('button', { name: /claim/i }));

    await waitFor(() => {
      expect(mockClaimFarmingRewards).toHaveBeenCalledWith(DEFAULT_CLAIMABLE_REWARDS);
      expect(mockClaimFarmingRewards).toHaveBeenCalledTimes(1);
    });

    app.unmount();

    mockGetClaimableFarmingRewards.mockReturnValue(new Map());

    app = await render(<App />, { path });

    expect(screen.queryByRole('button', { name: /claim/i })).not.toBeInTheDocument();

    mockGetClaimableFarmingRewards.mockReturnValue(DEFAULT_CLAIMABLE_REWARDS);
  });

  it('should be able to enter customisable input amounts mode', async () => {
    jest
      .spyOn(DEFAULT_LIQUIDITY_POOL_1, 'getLiquidityDepositInputAmounts')
      .mockReturnValue(DEFAULT_POOLED_CURRENCIES_1);

    const [DEFAULT_CURRENCY_1, DEFAULT_CURRENCY_2] = DEFAULT_POOLED_CURRENCIES_1;

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.AVAILABLE_POOLS, DEFAULT_LP_TOKEN_1.ticker, TABS.DEPOSIT);

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: new RegExp(`${DEFAULT_CURRENCY_1.currency.ticker} deposit amount`, 'i')
      }),
      DEFAULT_CURRENCY_1.toString(),
      { delay: 1 }
    );

    expect(DEFAULT_LIQUIDITY_POOL_1.getLiquidityDepositInputAmounts).toHaveBeenCalledWith(DEFAULT_CURRENCY_1);

    await waitFor(() => {
      expect(
        tabPanel.getByRole('textbox', {
          name: new RegExp(`${DEFAULT_CURRENCY_2.currency.ticker} deposit amount`, 'i')
        })
      ).toHaveValue(DEFAULT_CURRENCY_2.toString());
    });

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: new RegExp(`${DEFAULT_CURRENCY_2.currency.ticker} deposit amount`, 'i')
      }),
      '10',
      { delay: 1 }
    );

    await waitFor(() => {
      expect(
        tabPanel.getByRole('textbox', {
          name: new RegExp(`${DEFAULT_CURRENCY_1.currency.ticker} deposit amount`, 'i')
        })
      ).toHaveValue(DEFAULT_CURRENCY_1.toString());
    });
  });
});
