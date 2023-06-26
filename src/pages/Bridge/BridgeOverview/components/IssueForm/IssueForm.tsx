import { CurrencyExt, getIssueRequestsFromExtrinsicResult, isCurrencyEqual, Issue } from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';

import { convertMonetaryAmountToValueInUSD, getRandomArrayElement, safeBitcoinAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  BRIDGE_ISSUE_AMOUNT_FIELD,
  BRIDGE_ISSUE_CUSTOM_VAULT_FIELD,
  BRIDGE_ISSUE_CUSTOM_VAULT_SWITCH,
  BRIDGE_ISSUE_FEE_TOKEN,
  BRIDGE_ISSUE_GRIEFING_COLLATERAL_TOKEN,
  BridgeIssueFormData,
  bridgeIssueSchema,
  useForm
} from '@/lib/form';
import { BridgeActions } from '@/types/bridge';
import { getTokenPrice } from '@/utils/helpers/prices';
import { IssueData, useGetIssueData } from '@/utils/hooks/api/bridge/use-get-issue-data';
import { BridgeVaultData, useGetVaults } from '@/utils/hooks/api/bridge/use-get-vaults';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { TransactionArgs } from '@/utils/hooks/transaction/types';
import { isTransactionFormDisabled } from '@/utils/hooks/transaction/utils/form';

import { LegacyIssueModal } from '../LegacyIssueModal';
import { RequestLimitsCard } from '../RequestLimitsCard';
import { SelectVaultCard } from '../SelectVaultCard';
import { TransactionDetails } from '../TransactionDetails';

type IssueFormProps = { requestLimits: IssueLimits } & IssueData;

const IssueForm = ({ requestLimits, dustValue, issueFee }: IssueFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();
  const { getSecurityDeposit } = useGetIssueData();
  const { getCurrencyFromTicker, isLoading: isLoadingCurrencies } = useGetCurrencies(true);

  const [issueRequest, setIssueRequest] = useState<Issue>();

  const [amount, setAmount] = useState<string>();
  const [debouncedAmount, setDebouncedAmount] = useState<string>();

  useDebounce(() => setDebouncedAmount(amount), 500, [amount]);

  const [selectedVault, setSelectedVault] = useState<BridgeVaultData>();

  const { data: vaultsData, getAvailableVaults } = useGetVaults(BridgeActions.ISSUE);

  const debouncedMonetaryAmount = safeBitcoinAmount(debouncedAmount || 0);
  const availableVaults = getAvailableVaults(debouncedMonetaryAmount);
  const vaults = availableVaults?.length ? availableVaults : vaultsData?.list;

  const transaction = useTransaction(Transaction.ISSUE_REQUEST, {
    showSuccessModal: false,
    onSuccess: async (result) => {
      try {
        const [issueRequest] = await getIssueRequestsFromExtrinsicResult(window.bridge, result.data);

        setIssueRequest(issueRequest);
      } catch (e: any) {
        transaction.reject(e);
      }

      setAmount(undefined);
      setDebouncedAmount(undefined);
      form.resetForm();
    }
  });

  const currentRequestLimit = selectedVault ? selectedVault.amount : requestLimits.singleVaultMaxIssuable;

  const transferAmountSchemaParams = {
    maxAmount: currentRequestLimit,
    minAmount: dustValue
  };

  const handleSubmit = async (values: BridgeIssueFormData) => {
    const args = getTransactionArgs(values);

    if (!args) return;

    transaction.execute(...args);
  };

  const getTransactionArgs = useCallback(
    (values: BridgeIssueFormData): TransactionArgs<Transaction.ISSUE_REQUEST> | undefined => {
      const amount = values[BRIDGE_ISSUE_AMOUNT_FIELD];
      const griefingCollateralCurrencyTicker = values[BRIDGE_ISSUE_GRIEFING_COLLATERAL_TOKEN];
      if (!vaultsData || !amount || griefingCollateralCurrencyTicker === undefined || isLoadingCurrencies) return;

      const monetaryAmount = new BitcoinAmount(amount);

      const availableVaults = getAvailableVaults(monetaryAmount);

      if (!availableVaults) return;

      const vaultId = values[BRIDGE_ISSUE_CUSTOM_VAULT_FIELD];

      let vault: BridgeVaultData | undefined;

      // If custom vault was select, try to find it in the data
      if (vaultId) {
        vault = availableVaults.find((item) => item.id === vaultId);
      }

      // If no vault provided nor the custom vault wasn't found (unlikely), choose random vault
      if (!vault) {
        vault = getRandomArrayElement(availableVaults);
      }

      const griefingCollateralCurrency = getCurrencyFromTicker(griefingCollateralCurrencyTicker);
      return [
        monetaryAmount,
        vault.vaultId.accountId,
        vault.collateralCurrency,
        false,
        vaultsData.map,
        griefingCollateralCurrency
      ];
    },
    [getAvailableVaults, getCurrencyFromTicker, isLoadingCurrencies, vaultsData]
  );

  const form = useForm<BridgeIssueFormData>({
    initialValues: {
      [BRIDGE_ISSUE_AMOUNT_FIELD]: '',
      [BRIDGE_ISSUE_CUSTOM_VAULT_FIELD]: '',
      [BRIDGE_ISSUE_CUSTOM_VAULT_SWITCH]: false,
      [BRIDGE_ISSUE_GRIEFING_COLLATERAL_TOKEN]: GOVERNANCE_TOKEN.ticker,
      [BRIDGE_ISSUE_FEE_TOKEN]: transaction.fee.defaultCurrency.ticker
    },
    validateOnChange: true,
    validationSchema: bridgeIssueSchema({ [BRIDGE_ISSUE_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    hideErrorMessages: transaction.isLoading,
    onComplete: (values) => {
      const args = getTransactionArgs(values);

      if (!args) return;

      const feeTicker = values[BRIDGE_ISSUE_FEE_TOKEN];

      transaction.fee.setCurrency(feeTicker).estimate(...args);
    }
  });

  const handleToggleCustomVault = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      form.setFieldTouched(BRIDGE_ISSUE_CUSTOM_VAULT_FIELD, false, true);
      form.setFieldValue(BRIDGE_ISSUE_CUSTOM_VAULT_FIELD, '', true);

      setSelectedVault(undefined);
    }
  };

  const handleChangeIssueAmount = (e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const handleVaultSelectionChange = (key: Key) => {
    if (!vaults) return;

    const vault = vaults.find((item) => item.id === key);

    setSelectedVault(vault);
  };

  const monetaryAmount = safeBitcoinAmount(amount || 0);
  const monetaryAmountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const bridgeFee = monetaryAmount.mul(issueFee.toBig());

  const griefingCollateralTicker = form.values[BRIDGE_ISSUE_GRIEFING_COLLATERAL_TOKEN];

  const [securityDeposit, setSecurityDeposit] = useState<MonetaryAmount<CurrencyExt>>();
  useEffect(() => {
    const computeSecurityDeposit = async () => {
      const btcAmount = safeBitcoinAmount(amount || 0);
      const griefingCollateralTicker = form.values[BRIDGE_ISSUE_GRIEFING_COLLATERAL_TOKEN];
      const deposit = await getSecurityDeposit(btcAmount, griefingCollateralTicker);
      setSecurityDeposit(deposit);
    };

    computeSecurityDeposit();
  }, [amount, form.values, setSecurityDeposit, getSecurityDeposit]);

  const totalAmount = monetaryAmount.gte(bridgeFee) ? monetaryAmount.sub(bridgeFee) : new BitcoinAmount(0);
  const totalAmountUSD = totalAmount
    ? convertMonetaryAmountToValueInUSD(totalAmount, getTokenPrice(prices, totalAmount.currency.ticker)?.usd) || 0
    : 0;

  const isSelectingVault = form.values[BRIDGE_ISSUE_CUSTOM_VAULT_SWITCH];

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  const griefingCollateralCurrencyBalance = griefingCollateralTicker
    ? getBalance(griefingCollateralTicker)?.free
    : undefined;

  const hasEnoughGriefingCollateralBalance = useMemo(() => {
    if (
      securityDeposit === undefined ||
      griefingCollateralCurrencyBalance === undefined ||
      !isCurrencyEqual(securityDeposit.currency, griefingCollateralCurrencyBalance.currency)
    ) {
      return false;
    }
    return griefingCollateralCurrencyBalance.gte(securityDeposit);
  }, [securityDeposit, griefingCollateralCurrencyBalance]);

  return (
    <>
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing4'>
              <RequestLimitsCard
                title={t('bridge.max_issuable')}
                singleRequestLimit={requestLimits.singleVaultMaxIssuable}
                maxRequestLimit={requestLimits.totalMaxIssuable}
              />
              <TokenInput
                placeholder='0.00'
                label={t('amount')}
                ticker='BTC'
                valueUSD={monetaryAmountUSD}
                {...mergeProps(form.getFieldProps(BRIDGE_ISSUE_AMOUNT_FIELD, false, true), {
                  onChange: handleChangeIssueAmount
                })}
              />
              <SelectVaultCard
                isSelectingVault={isSelectingVault}
                vaults={vaults}
                switchProps={mergeProps(form.getFieldProps(BRIDGE_ISSUE_CUSTOM_VAULT_SWITCH), {
                  onChange: handleToggleCustomVault
                })}
                selectProps={{
                  ...mergeProps(form.getFieldProps(BRIDGE_ISSUE_CUSTOM_VAULT_FIELD, false, true), {
                    onSelectionChange: handleVaultSelectionChange
                  })
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
                securityDepositSelectProps={form.getFieldProps(BRIDGE_ISSUE_GRIEFING_COLLATERAL_TOKEN, true)}
                feeDetailsProps={{
                  ...transaction.fee.detailsProps,
                  selectProps: form.getFieldProps(BRIDGE_ISSUE_FEE_TOKEN, true)
                }}
              />
              <AuthCTA
                type='submit'
                disabled={isBtnDisabled || !hasEnoughGriefingCollateralBalance}
                size='large'
                loading={transaction.isLoading}
              >
                {hasEnoughGriefingCollateralBalance
                  ? t('issue')
                  : t('insufficient_token_balance', { token: griefingCollateralTicker })}
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
