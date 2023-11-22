import {
  CurrencyExt,
  getIssueRequestsFromExtrinsicResult,
  isCurrencyEqual,
  Issue,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';

import { convertMonetaryAmountToValueInUSD, getRandomArrayElement, safeBitcoinAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { IssueData, useGetIssueData } from '@/hooks/api/bridge/use-get-issue-data';
import { BridgeVaultData, GetVaultType, useGetVaults } from '@/hooks/api/bridge/use-get-vaults';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/hooks/api/use-get-currencies';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { TransactionArgs } from '@/hooks/transaction/types';
import { isTransactionFormDisabled } from '@/hooks/transaction/utils/form';
import {
  BTC_ISSUE_AMOUNT_FIELD,
  BTC_ISSUE_CUSTOM_VAULT_FIELD,
  BTC_ISSUE_CUSTOM_VAULT_SWITCH,
  BTC_ISSUE_FEE_TOKEN,
  BTC_ISSUE_SECURITY_DEPOSIT_TOKEN,
  BTCIssueFormData,
  btcIssueSchema,
  useForm
} from '@/lib/form';
import { getTokenPrice } from '@/utils/helpers/prices';

import { LegacyIssueModal } from '../LegacyIssueModal';
import { RequestLimitsCard } from '../RequestLimitsCard';
import { SelectVaultCard } from '../SelectVaultCard';
import { TransactionDetails } from '../TransactionDetails';

type IssueFormProps = { requestLimits: IssueLimits } & IssueData;

const IssueForm = ({ requestLimits, dustValue, issueFee }: IssueFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getAvailableBalance } = useGetBalances();
  const { getSecurityDeposit } = useGetIssueData();
  const { getCurrencyFromTicker, isLoading: isLoadingCurrencies } = useGetCurrencies(true);

  const [issueRequest, setIssueRequest] = useState<Issue>();

  const [amount, setAmount] = useState<string>();
  const [debouncedAmount, setDebouncedAmount] = useState<string>();

  useDebounce(() => setDebouncedAmount(amount), 500, [amount]);

  const [securityDeposit, setSecurityDeposit] = useState<MonetaryAmount<CurrencyExt>>(
    newMonetaryAmount(0, GOVERNANCE_TOKEN)
  );

  const [selectedVault, setSelectedVault] = useState<BridgeVaultData>();

  const { data: vaultsData, getAvailableVaults } = useGetVaults(GetVaultType.ISSUE);

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

  const handleSubmit = async (values: BTCIssueFormData) => {
    const args = getTransactionArgs(values);

    if (!args) return;

    transaction.execute(...args);
  };

  const getTransactionArgs = useCallback(
    (values: BTCIssueFormData): TransactionArgs<Transaction.ISSUE_REQUEST> | undefined => {
      const amount = values[BTC_ISSUE_AMOUNT_FIELD];
      const securityDepositTicker = values[BTC_ISSUE_SECURITY_DEPOSIT_TOKEN];
      if (!vaultsData || !amount || securityDepositTicker === undefined || isLoadingCurrencies) return;

      const monetaryAmount = new BitcoinAmount(amount);

      const availableVaults = getAvailableVaults(monetaryAmount);

      if (!availableVaults) return;

      const vaultId = values[BTC_ISSUE_CUSTOM_VAULT_FIELD];

      let vault: BridgeVaultData | undefined;

      // If custom vault was select, try to find it in the data
      if (vaultId) {
        vault = availableVaults.find((item) => item.id === vaultId);
      }

      // If no vault provided nor the custom vault wasn't found (unlikely), choose random vault
      if (!vault) {
        vault = getRandomArrayElement(availableVaults);
      }

      const securityDeposit = getCurrencyFromTicker(securityDepositTicker);
      return [
        monetaryAmount,
        vault.vaultId.accountId,
        vault.collateralCurrency,
        false,
        vaultsData.map,
        securityDeposit
      ];
    },
    [getAvailableVaults, getCurrencyFromTicker, isLoadingCurrencies, vaultsData]
  );

  const form = useForm<BTCIssueFormData>({
    initialValues: {
      [BTC_ISSUE_AMOUNT_FIELD]: '',
      [BTC_ISSUE_CUSTOM_VAULT_FIELD]: '',
      [BTC_ISSUE_CUSTOM_VAULT_SWITCH]: false,
      [BTC_ISSUE_SECURITY_DEPOSIT_TOKEN]: GOVERNANCE_TOKEN.ticker,
      [BTC_ISSUE_FEE_TOKEN]: transaction.fee.defaultCurrency.ticker
    },
    validateOnChange: true,
    validationSchema: btcIssueSchema({ [BTC_ISSUE_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    hideErrorMessages: transaction.isLoading,
    onComplete: (values) => {
      const args = getTransactionArgs(values);

      if (!args) return;

      transaction.fee.estimate(...args);
    }
  });

  const securityDepositTicker = form.values[BTC_ISSUE_SECURITY_DEPOSIT_TOKEN];

  useEffect(() => {
    const computeSecurityDeposit = async () => {
      const btcAmount = safeBitcoinAmount(debouncedAmount || 0);
      const deposit = await getSecurityDeposit(btcAmount, securityDepositTicker);

      if (!deposit) return;

      setSecurityDeposit(deposit);
    };

    computeSecurityDeposit();
  }, [debouncedAmount, securityDepositTicker, setSecurityDeposit, getSecurityDeposit]);

  const handleToggleCustomVault = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      form.setFieldTouched(BTC_ISSUE_CUSTOM_VAULT_FIELD, false, true);
      form.setFieldValue(BTC_ISSUE_CUSTOM_VAULT_FIELD, '', true);

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

  const totalAmount = monetaryAmount.gte(bridgeFee) ? monetaryAmount.sub(bridgeFee) : new BitcoinAmount(0);
  const totalAmountUSD = totalAmount
    ? convertMonetaryAmountToValueInUSD(totalAmount, getTokenPrice(prices, totalAmount.currency.ticker)?.usd) || 0
    : 0;

  const isSelectingVault = form.values[BTC_ISSUE_CUSTOM_VAULT_SWITCH];

  const securityDepositBalance = securityDepositTicker ? getAvailableBalance(securityDepositTicker) : undefined;

  const hasAvailableSecurityDepositBalance = useMemo(() => {
    if (!debouncedAmount) return true;

    if (!securityDepositBalance || !isCurrencyEqual(securityDeposit.currency, securityDepositBalance.currency)) {
      return false;
    }

    // when security deposit currency is equal to fee currency it should be taken into account
    if (transaction.fee.data && transaction.fee.isEqualFeeCurrency(securityDepositBalance.currency)) {
      return securityDepositBalance.sub(transaction.fee.data.amount).gte(securityDeposit);
    }

    return securityDepositBalance.gte(securityDeposit);
  }, [debouncedAmount, securityDepositBalance, securityDeposit, transaction.fee]);

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee) || !hasAvailableSecurityDepositBalance;

  return (
    <>
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing4'>
              <RequestLimitsCard
                title={t('btc.max_issuable')}
                singleRequestLimit={requestLimits.singleVaultMaxIssuable}
                maxRequestLimit={requestLimits.totalMaxIssuable}
              />
              <TokenInput
                placeholder='0.00'
                label={t('amount')}
                ticker='BTC'
                valueUSD={monetaryAmountUSD}
                {...mergeProps(form.getFieldProps(BTC_ISSUE_AMOUNT_FIELD, false, true), {
                  onChange: handleChangeIssueAmount
                })}
              />
              <SelectVaultCard
                isSelectingVault={isSelectingVault}
                vaults={vaults}
                switchProps={mergeProps(form.getFieldProps(BTC_ISSUE_CUSTOM_VAULT_SWITCH), {
                  onChange: handleToggleCustomVault
                })}
                selectProps={{
                  ...mergeProps(form.getSelectFieldProps(BTC_ISSUE_CUSTOM_VAULT_FIELD, false, true), {
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
                securityDepositSelectProps={form.getSelectFieldProps(BTC_ISSUE_SECURITY_DEPOSIT_TOKEN, true)}
                showInsufficientSecurityBalance={!hasAvailableSecurityDepositBalance}
                feeDetailsProps={{
                  fee: transaction.fee,
                  selectProps: form.getSelectFieldProps(BTC_ISSUE_FEE_TOKEN, true)
                }}
              />
              <AuthCTA type='submit' disabled={isBtnDisabled} size='large' loading={transaction.isLoading}>
                {t('issue')}
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
