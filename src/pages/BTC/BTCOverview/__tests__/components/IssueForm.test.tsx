import * as api from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import { MOCK_FEE, MOCK_ISSUE, MOCK_VAULTS } from '@/test/mocks/@interlay/interbtc-api';
import { mockIssue } from '@/test/mocks/@interlay/interbtc-api/issue';
import { waitForFeeEstimate, waitForTransactionExecute } from '@/test/pages/utils/transaction';
import { act, render, screen, userEvent, waitFor, within } from '@/test/test-utils';
import { NATIVE_CURRENCIES } from '@/utils/constants/currency';
import * as oracle from '@/utils/hooks/api/oracle/use-get-oracle-currencies';

import { IssueForm } from '../../components';

const { request } = MOCK_ISSUE.MODULE;
const { getVaultsWithIssuableTokens, getVaultsWithRedeemableTokens } = MOCK_VAULTS.MODULE;

const { VAULTS_TOKENS, VAULTS_ID, VAULT_COLLATERAL } = MOCK_VAULTS.DATA;
const { REQUEST_LIMIT, DUST_VALUE, ISSUE_AMOUNTS } = MOCK_ISSUE.DATA;
const { ISSUE_FEE, GRIEFING_COLLATERAL_RATE } = MOCK_FEE.DATA;

jest.mock('../../components/LegacyIssueModal', () => ({ LegacyIssueModal: () => <div>legacy issue modal</div> }));

describe('IssueForm', () => {
  const { singleVaultMaxIssuable } = REQUEST_LIMIT.FULL;

  beforeEach(() => {
    getVaultsWithRedeemableTokens.mockResolvedValue(VAULTS_TOKENS.FULL);
    getVaultsWithIssuableTokens.mockResolvedValue(VAULTS_TOKENS.FULL);
    jest.spyOn(api, 'getIssueRequestsFromExtrinsicResult').mockResolvedValue([mockIssue]);
  });

  it('should be able to issue request with default security deposit', async () => {
    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.FULL}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), singleVaultMaxIssuable.toString());

    await waitForFeeEstimate(request);

    userEvent.click(screen.getByRole('button', { name: /issue/i }));

    await waitForTransactionExecute(request);

    expect(request).toHaveBeenCalledWith(
      singleVaultMaxIssuable,
      VAULTS_ID.RELAY.accountId,
      VAULT_COLLATERAL.RELAY,
      false,
      VAULTS_TOKENS.FULL,
      GOVERNANCE_TOKEN
    );

    await waitFor(() => {
      expect(screen.getByText(/legacy issue modal/i)).toBeInTheDocument();
    });

    // form should reset
    expect(screen.getByRole('textbox', { name: /amount/i })).toHaveTextContent('');
  });

  it('should be able to issue request with custom security deposit', async () => {
    jest.spyOn(oracle, 'useGetOracleCurrencies').mockReturnValue({ data: NATIVE_CURRENCIES });

    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.FULL}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    userEvent.click(screen.getByRole('button', { name: /security deposit token/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /select token/i })).toBeInTheDocument();
    });

    const securityDepositDialog = within(screen.getByRole('dialog', { name: /select token/i }));

    userEvent.click(securityDepositDialog.getByRole('row', { name: RELAY_CHAIN_NATIVE_TOKEN.ticker }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /security deposit token/i })).toHaveTextContent(
        RELAY_CHAIN_NATIVE_TOKEN.ticker
      );
    });

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), singleVaultMaxIssuable.toString());

    await waitForFeeEstimate(request);

    userEvent.click(screen.getByRole('button', { name: /issue/i }));

    await waitForTransactionExecute(request);

    expect(request).toHaveBeenCalledWith(
      singleVaultMaxIssuable,
      VAULTS_ID.RELAY.accountId,
      VAULT_COLLATERAL.RELAY,
      false,
      VAULTS_TOKENS.FULL,
      RELAY_CHAIN_NATIVE_TOKEN
    );

    await waitFor(() => {
      expect(screen.getByText(/legacy issue modal/i)).toBeInTheDocument();
    });
  });

  it('should be able to issue request with custom vault', async () => {
    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.FULL}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    userEvent.click(screen.getByRole('switch', { name: /manually select vault/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /vault/i })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /vault/i }));

    const vaultDialog = within(screen.getByRole('dialog', { name: /select vault/i }));

    const vaults = vaultDialog.getAllByRole('row', { name: VAULTS_ID.GOVERNANCE.accountId, exact: false });

    expect(vaults).toHaveLength(2);

    userEvent.click(vaults[1]);

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), ISSUE_AMOUNTS.HALF.toString());

    await waitForFeeEstimate(request);

    userEvent.click(screen.getByRole('button', { name: /issue/i }));

    await waitForTransactionExecute(request);

    expect(request).toHaveBeenCalledWith(
      ISSUE_AMOUNTS.HALF,
      VAULTS_ID.GOVERNANCE.accountId,
      VAULT_COLLATERAL.GOVERNANCE,
      false,
      VAULTS_TOKENS.FULL,
      GOVERNANCE_TOKEN
    );

    await waitFor(() => {
      expect(screen.getByText(/legacy issue modal/i)).toBeInTheDocument();
    });
  });

  it('should only show vaults with available capacity', async () => {
    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.FULL}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), singleVaultMaxIssuable.toString());

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    userEvent.click(screen.getByRole('switch', { name: /manually select vault/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /vault/i })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /vault/i }));

    const vaultDialog = within(screen.getByRole('dialog', { name: /select vault/i }));

    expect(vaultDialog.getAllByRole('row')).toHaveLength(1);
  });

  it('should not be able to issue request because of request limits', async () => {
    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.EMPTY}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), singleVaultMaxIssuable.toString());

    userEvent.click(screen.getByRole('button', { name: /issue/i }));

    expect(request).not.toHaveBeenCalled();
  });

  it('should not be able to issue request because of empty vaults', async () => {
    getVaultsWithIssuableTokens.mockResolvedValue(VAULTS_TOKENS.EMPTY);

    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.FULL}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), singleVaultMaxIssuable.toString());

    userEvent.click(screen.getByRole('button', { name: /issue/i }));

    expect(request).not.toHaveBeenCalled();
  });

  it('should not be able to issue request because of empty map', async () => {
    getVaultsWithIssuableTokens.mockResolvedValue(new Map());

    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.FULL}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), singleVaultMaxIssuable.toString());

    userEvent.click(screen.getByRole('button', { name: /issue/i }));

    expect(request).not.toHaveBeenCalled();
  });
});
