import { newMonetaryAmount } from '@interlay/interbtc-api';

import App from '@/App';

import { MOCK_AMM, MOCK_SYSTEM } from '../mocks/@interlay/interbtc-api';
import { DEFAULT_ACCOUNT_1 } from '../mocks/substrate/mocks';
import { render, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from '../test-utils';
import { withinModalTabPanel, withinTable, withinTableRow } from './utils/table';
import { getFeeTokenSelect, waitForFeeEstimate, waitForTransactionExecute } from './utils/transaction';

const { LP_TOKEN_A, LP_TOKEN_B, LP_TOKEN_EMPTY, ACCOUNT_LIQUIDITY, CLAIMABLE_REWARDS, LIQUIDITY_POOLS } = MOCK_AMM.DATA;

const {
  getLiquidityProvidedByAccount,
  addLiquidity,
  removeLiquidity,
  claimFarmingRewards,
  getClaimableFarmingRewards
} = MOCK_AMM.MODULE;

const { BLOCK_NUMBER } = MOCK_SYSTEM.DATA;
const { getFutureBlockNumber } = MOCK_SYSTEM.MODULE;

jest.mock('@/components/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return {
    Layout: MockedLayout
  };
});

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
describe('Pools Page', () => {
  beforeEach(() => {
    getLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_LIQUIDITY.EMPTY);
  });

  it('should only render available pools', async () => {
    await render(<App />, { path });

    const otherPoolsTable = withinTable(TABLES.AVAILABLE_POOLS);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(3);
    expect(otherPoolsTable.getByRole('row', { name: LP_TOKEN_A.ticker })).toBeInTheDocument();
    expect(otherPoolsTable.getByRole('row', { name: LP_TOKEN_B.ticker })).toBeInTheDocument();
    expect(otherPoolsTable.getByRole('row', { name: LP_TOKEN_EMPTY.ticker })).toBeInTheDocument();

    expect(screen.queryByRole('grid', { name: new RegExp(TABLES.ACCOUNT_POOLS, 'i') })).not.toBeInTheDocument();
  });

  it('should render both available and account pools', async () => {
    getLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_LIQUIDITY.AVERAGE);

    await render(<App />, { path });

    const otherPoolsTable = withinTable(TABLES.AVAILABLE_POOLS);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(2);
    expect(otherPoolsTable.getByRole('row', { name: LP_TOKEN_A.ticker })).toBeInTheDocument();

    const myPoolsTable = withinTable(TABLES.ACCOUNT_POOLS);

    expect(myPoolsTable.getAllByRole('row')).toHaveLength(1);
    expect(myPoolsTable.getByRole('row', { name: LP_TOKEN_B.ticker })).toBeInTheDocument();
  });

  it('should render account pools', async () => {
    getLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_LIQUIDITY.FULL);

    await render(<App />, { path });

    expect(screen.queryByRole('grid', { name: new RegExp(TABLES.AVAILABLE_POOLS, 'i') })).not.toBeInTheDocument();

    const myPoolsTable = withinTable(TABLES.ACCOUNT_POOLS);

    expect(myPoolsTable.getAllByRole('row')).toHaveLength(3);
  });

  it('should be able to deposit', async () => {
    jest
      .spyOn(LIQUIDITY_POOLS.ONE, 'getLiquidityDepositInputAmounts')
      .mockReturnValue(LIQUIDITY_POOLS.ONE.pooledCurrencies);

    const [DEFAULT_CURRENCY_1, DEFAULT_CURRENCY_2] = LIQUIDITY_POOLS.ONE.pooledCurrencies;

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.AVAILABLE_POOLS, LP_TOKEN_A.ticker, TABS.DEPOSIT);

    expect(getFeeTokenSelect(tabPanel)).toBeInTheDocument();

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: new RegExp(`${DEFAULT_CURRENCY_1.currency.ticker} deposit amount`, 'i')
      }),
      DEFAULT_CURRENCY_1.toString(),
      { delay: 1 }
    );

    expect(LIQUIDITY_POOLS.ONE.getLiquidityDepositInputAmounts).toHaveBeenCalledWith(DEFAULT_CURRENCY_1);

    await waitFor(() => {
      expect(
        tabPanel.getByRole('textbox', {
          name: new RegExp(`${DEFAULT_CURRENCY_2.currency.ticker} deposit amount`, 'i')
        })
      ).toHaveValue(DEFAULT_CURRENCY_2.toString());
    });

    await waitForFeeEstimate(addLiquidity);

    expect(getFutureBlockNumber).toHaveBeenCalledTimes(1);

    userEvent.click(tabPanel.getByRole('button', { name: /add liquidity/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog', { name: /deposit/i, exact: false }));

    await waitForTransactionExecute(addLiquidity);

    expect(getFutureBlockNumber).toHaveBeenCalledTimes(2);
    expect(addLiquidity).toHaveBeenCalledWith(
      LIQUIDITY_POOLS.ONE.pooledCurrencies,
      LIQUIDITY_POOLS.ONE,
      0.1,
      BLOCK_NUMBER.FUTURE,
      DEFAULT_ACCOUNT_1.address
    );
  });

  it('should be able to withdraw', async () => {
    getLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_LIQUIDITY.AVERAGE);

    const LP_TOKEN_INPUT = newMonetaryAmount(0.1, LP_TOKEN_B, true);

    jest.spyOn(LIQUIDITY_POOLS.TWO, 'getLiquidityWithdrawalPooledCurrencyAmounts').mockReturnValue([]);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.ACCOUNT_POOLS, LP_TOKEN_B.ticker, TABS.WITHDRAW, true);

    expect(getFeeTokenSelect(tabPanel)).toBeInTheDocument();

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: /withdraw amount/i
      }),
      LP_TOKEN_INPUT.toString(),
      { delay: 1 }
    );

    await waitForFeeEstimate(removeLiquidity);

    userEvent.click(tabPanel.getByRole('button', { name: /remove liquidity/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog', { name: /withdraw/i, exact: false }));

    await waitForTransactionExecute(removeLiquidity);

    expect(getFutureBlockNumber).toHaveBeenCalledTimes(2);
    expect(removeLiquidity).toHaveBeenCalledWith(
      LP_TOKEN_INPUT,
      LIQUIDITY_POOLS.TWO,
      0.1,
      BLOCK_NUMBER.FUTURE,
      DEFAULT_ACCOUNT_1.address
    );
  });

  it('should be able to claim rewards', async () => {
    let app = await render(<App />, { path });

    userEvent.click(screen.getByRole('button', { name: /claim/i }));

    await waitForFeeEstimate(claimFarmingRewards);

    const dialog = within(screen.getByRole('dialog', { name: /claim rewards/i }));

    expect(getFeeTokenSelect(dialog)).toBeInTheDocument();

    userEvent.click(dialog.getByRole('button', { name: /claim rewards/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog', { name: /claim rewards/i }));

    await waitForTransactionExecute(claimFarmingRewards);

    app.unmount();

    getClaimableFarmingRewards.mockReturnValue(new Map());

    app = await render(<App />, { path });

    expect(screen.queryByRole('button', { name: /claim/i })).not.toBeInTheDocument();

    getClaimableFarmingRewards.mockReturnValue(CLAIMABLE_REWARDS);
  });

  it('should be able to enter customisable input amounts mode', async () => {
    jest
      .spyOn(LIQUIDITY_POOLS.ONE, 'getLiquidityDepositInputAmounts')
      .mockReturnValue(LIQUIDITY_POOLS.ONE.pooledCurrencies);

    const [DEFAULT_CURRENCY_1, DEFAULT_CURRENCY_2] = LIQUIDITY_POOLS.ONE.pooledCurrencies;

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.AVAILABLE_POOLS, LP_TOKEN_A.ticker, TABS.DEPOSIT);

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: new RegExp(`${DEFAULT_CURRENCY_1.currency.ticker} deposit amount`, 'i')
      }),
      DEFAULT_CURRENCY_1.toString(),
      { delay: 1 }
    );

    expect(LIQUIDITY_POOLS.ONE.getLiquidityDepositInputAmounts).toHaveBeenCalledWith(DEFAULT_CURRENCY_1);

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

  it('should render illiquid pool and deposit with custom ratio', async () => {
    jest
      .spyOn(LIQUIDITY_POOLS.EMPTY, 'getLiquidityDepositInputAmounts')
      .mockReturnValue(LIQUIDITY_POOLS.EMPTY.pooledCurrencies);

    const [EMPTY_POOL_CURRENCY_1, EMPTY_POOL_CURRENCY_2] = LIQUIDITY_POOLS.EMPTY.pooledCurrencies;

    await render(<App />, { path });

    const row = withinTableRow(TABLES.AVAILABLE_POOLS, LP_TOKEN_EMPTY.ticker);
    expect(row.getByText(/illiquid/i)).toBeInTheDocument();

    const tabPanel = await withinModalTabPanel(TABLES.AVAILABLE_POOLS, LP_TOKEN_EMPTY.ticker, TABS.DEPOSIT);

    expect(tabPanel.getByRole('alert')).toBeInTheDocument();

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: new RegExp(`${EMPTY_POOL_CURRENCY_1.currency.ticker} deposit amount`, 'i')
      }),
      '1',
      { delay: 1 }
    );

    await waitFor(() => {
      expect(
        tabPanel.getByRole('textbox', {
          name: new RegExp(`${EMPTY_POOL_CURRENCY_2.currency.ticker} deposit amount`, 'i')
        })
      ).toHaveValue('');
    });

    await userEvent.type(
      tabPanel.getByRole('textbox', {
        name: new RegExp(`${EMPTY_POOL_CURRENCY_2.currency.ticker} deposit amount`, 'i')
      }),
      '2',
      { delay: 1 }
    );

    await waitFor(() => {
      expect(
        tabPanel.getByRole('textbox', {
          name: new RegExp(`${EMPTY_POOL_CURRENCY_1.currency.ticker} deposit amount`, 'i')
        })
      ).toHaveValue('1');
    });

    expect(LIQUIDITY_POOLS.EMPTY.getLiquidityDepositInputAmounts).not.toHaveBeenCalled();
  });
});
