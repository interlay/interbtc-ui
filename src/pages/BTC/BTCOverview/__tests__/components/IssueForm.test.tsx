import * as api from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import { MOCK_FEE, MOCK_ISSUE, MOCK_VAULTS } from '@/test/mocks/@interlay/interbtc-api';
import { mockIssue } from '@/test/mocks/@interlay/interbtc-api/issue';
import { waitForFeeEstimate, waitForTransactionExecute } from '@/test/pages/utils/transaction';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';

import { IssueForm } from '../../components';

const { request } = MOCK_ISSUE.MODULE;
const { getVaultsWithIssuableTokens } = MOCK_VAULTS.MODULE;

const { VAULTS_TOKENS } = MOCK_VAULTS.DATA;
const { REQUEST_LIMIT, DUST_VALUE } = MOCK_ISSUE.DATA;
const { ISSUE_FEE, GRIEFING_COLLATERAL_RATE } = MOCK_FEE.DATA;

jest.mock('../../components/LegacyIssueModal', () => ({ LegacyIssueModal: () => <div>legacy issue modal</div> }));

describe('IssueForm', () => {
  it('should be able to issue request', async () => {
    jest.spyOn(api, 'getIssueRequestsFromExtrinsicResult').mockResolvedValue([mockIssue]);

    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.FULL}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    const { singleVaultMaxIssuable } = REQUEST_LIMIT.FULL;

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), singleVaultMaxIssuable.toString());

    await waitForFeeEstimate(request);

    userEvent.click(screen.getByRole('button', { name: /issue/i }));

    await waitForTransactionExecute(request);

    await waitFor(() => {
      expect(screen.getByText(/legacy issue modal/i)).toBeInTheDocument();
    });
  });

  it('should not be able to issue request', async () => {
    jest.spyOn(api, 'getIssueRequestsFromExtrinsicResult').mockResolvedValue([mockIssue]);
    getVaultsWithIssuableTokens.mockResolvedValue(VAULTS_TOKENS.FULL);

    await render(
      <IssueForm
        requestLimits={REQUEST_LIMIT.EMPTY}
        dustValue={DUST_VALUE}
        griefingCollateralRate={GRIEFING_COLLATERAL_RATE}
        issueFee={new BitcoinAmount(ISSUE_FEE)}
      />
    );

    const { singleVaultMaxIssuable } = REQUEST_LIMIT.FULL;

    userEvent.type(screen.getByRole('textbox', { name: /amount/i }), singleVaultMaxIssuable.toString());

    userEvent.click(screen.getByRole('button', { name: /issue/i }));

    expect(request).not.toHaveBeenCalled();
  });
});
