import { getIssueRequestsFromExtrinsicResult, Issue, newMonetaryAmount } from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { BitcoinAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ChangeEvent, Key, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';

import {
  convertMonetaryAmountToValueInUSD,
  getRandomArrayElement,
  newSafeBitcoinAmount,
  newSafeMonetaryAmount
} from '@/common/utils/utils';
import { Flex, TokenInput, Tooltip } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  BRIDGE_ISSUE_AMOUNT_FIELD,
  BRIDGE_ISSUE_MANUAL_VAULT_FIELD,
  BRIDGE_ISSUE_VAULT_FIELD,
  BridgeIssueFormData,
  bridgeIssueSchema,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { getTokenPrice } from '@/utils/helpers/prices';
import { IssueData, useGetIssueData } from '@/utils/hooks/api/bridge/use-get-issue-data';
import { BridgeVaultData, useGetVaults } from '@/utils/hooks/api/bridge/use-get-vaults';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { IssueLimitsCard } from '../IssueLimitsCard';
import { LegacyIssueModal } from '../LegacyIssueModal';
import { VaultSelect } from '../VaultSelect';
import { StyledSwitch } from './IssueForm.styles';
import { TransactionDetails } from './TransactionDetails';

const isInputOverRequestLimit = (inputAmount: BitcoinAmount, limits: IssueLimits) =>
  inputAmount.gt(limits.singleVaultMaxIssuable);

type IssueFormProps = { requestLimits: IssueLimits; data: IssueData };

const IssueForm = ({ requestLimits, data }: IssueFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();
  const { getSecurityDeposit } = useGetIssueData();

  const [issueRequest, setIssueRequest] = useState<Issue>();

  const [amount, setAmount] = useState<string>();
  const [debouncedAmount, setDecounbedAmount] = useState<string>();

  const transaction = useTransaction(Transaction.ISSUE_REQUEST, {
    onSuccess: async (result) => {
      try {
        const [issueRequest] = await getIssueRequestsFromExtrinsicResult(window.bridge, result.data);

        setIssueRequest(issueRequest);
      } catch (e: any) {
        transaction.reject(e);
      }

      form.resetForm();
    },
    showSuccessModal: false
  });

  const { data: vaultsData, getAvailableVaults } = useGetVaults({ action: 'issue' });

  useDebounce(() => setDecounbedAmount(amount), 500, [amount]);

  useDebounce(
    () => {
      const isSelectingVault = form.values[BRIDGE_ISSUE_MANUAL_VAULT_FIELD];

      if (!amount || !isSelectingVault) return;

      const monetaryAmount = newSafeBitcoinAmount(amount);
      const shouldShowVaults = !isInputOverRequestLimit(monetaryAmount, requestLimits);

      if (!shouldShowVaults) {
        form.resetForm({
          values: {
            ...form.values,
            [BRIDGE_ISSUE_MANUAL_VAULT_FIELD]: shouldShowVaults,
            [BRIDGE_ISSUE_VAULT_FIELD]: ''
          },
          touched: {
            ...form.touched,
            [BRIDGE_ISSUE_MANUAL_VAULT_FIELD]: false,
            [BRIDGE_ISSUE_VAULT_FIELD]: false
          },
          errors: {
            ...form.errors,
            [BRIDGE_ISSUE_MANUAL_VAULT_FIELD]: undefined,
            [BRIDGE_ISSUE_VAULT_FIELD]: undefined
          }
        });
      }
    },
    500,
    [amount, requestLimits]
  );

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: requestLimits.singleVaultMaxIssuable,
    minAmount: data.dustValue,
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const handleSubmit = async (values: BridgeIssueFormData) => {
    const amount = values[BRIDGE_ISSUE_AMOUNT_FIELD];

    if (!vaultsData || !amount) return;

    const monetaryAmount = new BitcoinAmount(amount);

    const availableVaults = getAvailableVaults(monetaryAmount);

    if (!availableVaults) return;

    const vaultId = values[BRIDGE_ISSUE_VAULT_FIELD];

    let vault: BridgeVaultData | undefined;

    // If custom vault was select, try to find it in the data
    if (vaultId) {
      vault = availableVaults.find((item) => item.id.toString() === vaultId);
    }

    console.log(vault);

    // If no vault provided nor the custom vault wasn't found (unlikely), choose random vault
    if (!vault) {
      vault = getRandomArrayElement(availableVaults);
    }

    transaction.execute(monetaryAmount, vault.vaultId.accountId, vault.collateralCurrency, false, vaultsData.raw);
  };

  const form = useForm<BridgeIssueFormData>({
    initialValues: {
      [BRIDGE_ISSUE_AMOUNT_FIELD]: '',
      [BRIDGE_ISSUE_VAULT_FIELD]: '',
      [BRIDGE_ISSUE_MANUAL_VAULT_FIELD]: false
    },
    validationSchema: bridgeIssueSchema({ [BRIDGE_ISSUE_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    showErrorMessages: !transaction.isLoading
  });

  const handleChangeSelectingVault = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      form.setFieldTouched(BRIDGE_ISSUE_VAULT_FIELD, false, true);
    }
  };

  const handleChangeIssueAmount = (e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const handleVaultSelectionChange = (key: Key) => {
    form.setFieldValue(BRIDGE_ISSUE_VAULT_FIELD, key, true);
  };

  const monetaryAmount = newSafeMonetaryAmount(amount || 0, WRAPPED_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const securityDeposit = getSecurityDeposit(monetaryAmount) || new BitcoinAmount(0);

  const debouncedMonetaryAmount = newSafeMonetaryAmount(debouncedAmount || 0, WRAPPED_TOKEN, true);
  const availableVaults = getAvailableVaults(debouncedMonetaryAmount);

  const totalAmount = monetaryAmount.gte(data.issueFee) ? monetaryAmount.sub(data.issueFee) : undefined;
  const totalAmountUSD = totalAmount
    ? convertMonetaryAmountToValueInUSD(totalAmount, getTokenPrice(prices, totalAmount.currency.ticker)?.usd) || 0
    : 0;

  const isSelectingVault = form.values[BRIDGE_ISSUE_MANUAL_VAULT_FIELD];

  const isBtnDisabled = isFormDisabled(form);

  const hasEnoughtGovernance = governanceBalance.gte(securityDeposit.add(TRANSACTION_FEE_AMOUNT));

  return (
    <>
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing8'>
            <Flex direction='column' gap='spacing4'>
              <IssueLimitsCard requestLimits={requestLimits} />
              <TokenInput
                placeholder='0.00'
                label='Amount'
                ticker='BTC'
                valueUSD={amountUSD}
                {...mergeProps(form.getFieldProps(BRIDGE_ISSUE_AMOUNT_FIELD), { onChange: handleChangeIssueAmount })}
              />
              <Flex direction='column' gap='spacing2'>
                <Tooltip
                  isDisabled={!!availableVaults?.length}
                  label='There are no vaults available with enought capacity. Adjust your issue amount.'
                >
                  <StyledSwitch
                    isSelected={isSelectingVault}
                    isDisabled={!availableVaults?.length}
                    labelProps={{ size: 'xs' }}
                    {...mergeProps(form.getFieldProps(BRIDGE_ISSUE_MANUAL_VAULT_FIELD), {
                      onChange: handleChangeSelectingVault
                    })}
                  >
                    Manually Select Vault
                  </StyledSwitch>
                </Tooltip>
                {isSelectingVault && availableVaults && (
                  <VaultSelect
                    items={availableVaults}
                    onSelectionChange={handleVaultSelectionChange}
                    placeholder='Select a vault'
                    aria-label='Vault'
                    {...form.getFieldProps(BRIDGE_ISSUE_VAULT_FIELD)}
                  />
                )}
              </Flex>
              <TokenInput
                placeholder='0.00'
                label='You will receive'
                isDisabled
                ticker={WRAPPED_TOKEN.ticker}
                value={totalAmount?.toString()}
                valueUSD={totalAmountUSD}
              />
            </Flex>
            <Flex direction='column' gap='spacing4'>
              <TransactionDetails issueFee={data.issueFee} securityDeposit={securityDeposit} />
              <AuthCTA
                type='submit'
                disabled={isBtnDisabled || !hasEnoughtGovernance}
                size='large'
                loading={transaction.isLoading}
              >
                {hasEnoughtGovernance ? t('issue') : `Insufficient ${GOVERNANCE_TOKEN.ticker}`}
              </AuthCTA>
            </Flex>
          </Flex>
        </form>
      </Flex>
      {issueRequest && (
        <LegacyIssueModal open={!!issueRequest} onClose={() => setIssueRequest(undefined)} request={issueRequest} />
      )}
    </>
  );
};

export { IssueForm };
export type { IssueFormProps };
