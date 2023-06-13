import { getIssueRequestsFromExtrinsicResult, Issue, newMonetaryAmount } from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { BitcoinAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ChangeEvent, Key, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, getRandomArrayElement, newSafeBitcoinAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  BRIDGE_ISSUE_AMOUNT_FIELD,
  BRIDGE_ISSUE_MANUAL_VAULT_SWITCH,
  BRIDGE_ISSUE_VAULT_FIELD,
  BridgeIssueFormData,
  bridgeIssueSchema,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { BridgeActions } from '@/types/bridge';
import { getTokenPrice } from '@/utils/helpers/prices';
import { IssueData, useGetIssueData } from '@/utils/hooks/api/bridge/use-get-issue-data';
import { BridgeVaultData, useGetVaults } from '@/utils/hooks/api/bridge/use-get-vaults';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { RequestLimitsCard } from '../RequestLimitsCard';
import { LegacyIssueModal } from '../LegacyIssueModal';
import { SelectVaultCard } from '../SelectVaultCard';
import { TransactionDetails } from '../TransactionDetails';

// const isInputOverRequestLimit = (inputAmount: BitcoinAmount, limits: IssueLimits) =>
//   inputAmount.gt(limits.singleVaultMaxIssuable);

type IssueFormProps = { requestLimits: IssueLimits } & IssueData;

const IssueForm = ({ requestLimits, dustValue, issueFee }: IssueFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();
  const { getSecurityDeposit } = useGetIssueData();

  const [issueRequest, setIssueRequest] = useState<Issue>();

  const [amount, setAmount] = useState<string>();
  // const [debouncedAmount, setDecounbedAmount] = useState<string>();

  const [selectedVault, setSelectedVault] = useState<BridgeVaultData>();

  const { data: vaultsData, getAvailableVaults } = useGetVaults(BridgeActions.ISSUE);

  // const debouncedMonetaryAmount = newSafeBitcoinAmount(debouncedAmount || 0);
  const availableVaults = vaultsData?.list;

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

  const currentRequestLimit = selectedVault ? selectedVault.amount : requestLimits.singleVaultMaxIssuable;

  // useDebounce(
  //   () => {
  //     if (!amount) return;

  //     const monetaryAmount = newSafeBitcoinAmount(amount);

  //     const isInvalidAmount = monetaryAmount.gt(currentRequestLimit);

  //     if (isInvalidAmount) return;

  //     setDecounbedAmount(amount);
  //   },
  //   500,
  //   [amount]
  // );

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: currentRequestLimit,
    minAmount: dustValue,
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
      vault = availableVaults.find((item) => item.id === vaultId);
    }

    console.log(vault);

    // If no vault provided nor the custom vault wasn't found (unlikely), choose random vault
    if (!vault) {
      vault = getRandomArrayElement(availableVaults);
    }

    transaction.execute(monetaryAmount, vault.vaultId.accountId, vault.collateralCurrency, false, vaultsData.map);
  };

  const form = useForm<BridgeIssueFormData>({
    initialValues: {
      [BRIDGE_ISSUE_AMOUNT_FIELD]: '',
      [BRIDGE_ISSUE_VAULT_FIELD]: '',
      [BRIDGE_ISSUE_MANUAL_VAULT_SWITCH]: false
    },
    validateOnChange: true,
    validationSchema: bridgeIssueSchema({ [BRIDGE_ISSUE_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    showErrorMessages: !transaction.isLoading
  });

  const handleChangeSelectingVault = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      form.setFieldTouched(BRIDGE_ISSUE_VAULT_FIELD, false, true);
      setSelectedVault(undefined);
      form.setFieldValue(BRIDGE_ISSUE_VAULT_FIELD, '', true);
    }
  };

  const handleChangeIssueAmount = (e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const handleVaultSelectionChange = (key: Key) => {
    form.setFieldValue(BRIDGE_ISSUE_VAULT_FIELD, key, true);

    if (!availableVaults) return;

    const vault = availableVaults.find((item) => item.id === key);

    setSelectedVault(vault);
  };

  const monetaryAmount = newSafeBitcoinAmount(amount || 0);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const bridgeFee = monetaryAmount.mul(issueFee.toBig());

  const securityDeposit = getSecurityDeposit(monetaryAmount) || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const totalAmount = monetaryAmount.gte(bridgeFee) ? monetaryAmount.sub(bridgeFee) : new BitcoinAmount(0);
  const totalAmountUSD = totalAmount
    ? convertMonetaryAmountToValueInUSD(totalAmount, getTokenPrice(prices, totalAmount.currency.ticker)?.usd) || 0
    : 0;

  const isSelectingVault = form.values[BRIDGE_ISSUE_MANUAL_VAULT_SWITCH];

  const isBtnDisabled = isFormDisabled(form);

  const hasEnoughtGovernance = governanceBalance.gte(securityDeposit.add(TRANSACTION_FEE_AMOUNT));

  return (
    <>
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing4'>
              <RequestLimitsCard
                title='Max issuable'
                singleRequestLimit={currentRequestLimit}
                maxRequestLimit={requestLimits.totalMaxIssuable}
              />
              <TokenInput
                placeholder='0.00'
                label='Amount'
                ticker='BTC'
                valueUSD={amountUSD}
                {...mergeProps(form.getFieldProps(BRIDGE_ISSUE_AMOUNT_FIELD), { onChange: handleChangeIssueAmount })}
              />
              <SelectVaultCard
                isSelectingVault={isSelectingVault}
                availableVaults={availableVaults}
                switchProps={mergeProps(form.getFieldProps(BRIDGE_ISSUE_MANUAL_VAULT_SWITCH), {
                  onChange: handleChangeSelectingVault
                })}
                selectProps={{
                  onSelectionChange: handleVaultSelectionChange,
                  ...form.getFieldProps(BRIDGE_ISSUE_VAULT_FIELD)
                }}
              />
            </Flex>
            <Flex direction='column' gap='spacing4'>
              <TransactionDetails
                totalAmount={totalAmount}
                totalAmountUSD={totalAmountUSD}
                totalTicker={WRAPPED_TOKEN.ticker}
                bridgeFee={bridgeFee}
                securityDeposit={securityDeposit}
              />
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
