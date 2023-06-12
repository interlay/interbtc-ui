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
import { Flex, Input, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  BRIDGE_REDEEM_ADDRESS,
  BRIDGE_REDEEM_AMOUNT_FIELD,
  BRIDGE_REDEEM_MANUAL_VAULT_FIELD,
  BRIDGE_REDEEM_PREMIUM_VAULT_FIELD,
  BRIDGE_REDEEM_VAULT_FIELD,
  BridgeRedeemFormData,
  bridgeRedeemSchema,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { BridgeActions } from '@/types/bridge';
import { getTokenPrice } from '@/utils/helpers/prices';
import { RedeemData, useGetRedeemData } from '@/utils/hooks/api/bridge/use-get-redeem-data';
import { BridgeVaultData, useGetVaults } from '@/utils/hooks/api/bridge/use-get-vaults';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { IssueLimitsCard } from '../BridgeLimitsCard';
import { LegacyIssueModal } from '../LegacyIssueModal';
import { SelectVaultCard } from '../SelectVaultCard';
import { TransactionDetails } from '../TransactionDetails';
import { PremiumRedeemCard } from './PremiumRedeemCard';

const isInputOverRequestLimit = (inputAmount: BitcoinAmount, limits: IssueLimits) =>
  inputAmount.gt(limits.singleVaultMaxIssuable);

type RedeemFormProps = { requestLimits: IssueLimits; data: RedeemData };

const RedeemForm = ({ requestLimits, data }: RedeemFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();
  const { getCompensationAmount } = useGetRedeemData();

  const [issueRequest, setIssueRequest] = useState<Issue>();

  const [amount, setAmount] = useState<string>();
  const [debouncedAmount, setDecounbedAmount] = useState<string>();

  const [isPremiumReddem, setPremiumRedeem] = useState(false);

  const transaction = useTransaction(Transaction.REDEEM_REQUEST, {
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

  const { data: vaultsData, getAvailableVaults } = useGetVaults({ action: BridgeActions.REDEEM });

  useDebounce(() => setDecounbedAmount(amount), 500, [amount]);

  useDebounce(
    () => {
      const isSelectingVault = form.values[BRIDGE_REDEEM_MANUAL_VAULT_FIELD];

      if (!amount || !isSelectingVault) return;

      const monetaryAmount = newSafeBitcoinAmount(amount);
      const shouldShowVaults = !isInputOverRequestLimit(monetaryAmount, requestLimits);

      if (!shouldShowVaults) {
        form.resetForm({
          values: {
            ...form.values,
            [BRIDGE_REDEEM_MANUAL_VAULT_FIELD]: shouldShowVaults,
            [BRIDGE_REDEEM_VAULT_FIELD]: ''
          },
          touched: {
            ...form.touched,
            [BRIDGE_REDEEM_VAULT_FIELD]: false
          },
          errors: {
            ...form.errors,
            [BRIDGE_REDEEM_MANUAL_VAULT_FIELD]: undefined,
            [BRIDGE_REDEEM_VAULT_FIELD]: undefined
          }
        });
      }
    },
    500,
    [amount, requestLimits]
  );

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const currentRequestLimit =
    isPremiumReddem && data.redeemLimit.premium ? data.redeemLimit.premium : data.redeemLimit.standard;

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: currentRequestLimit,
    minAmount: data.dustValue,
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const handleSubmit = async (values: BridgeRedeemFormData) => {
    const amount = values[BRIDGE_REDEEM_AMOUNT_FIELD];

    if (!vaultsData || !amount) return;

    const monetaryAmount = newMonetaryAmount(amount, WRAPPED_TOKEN, true);

    // const isPremiumRedeem = form.values[BRIDGE_REDEEM_PREMIUM_VAULT_FIELD];

    const availableVaults = getAvailableVaults(monetaryAmount);

    if (!availableVaults) return;

    const vaultId = values[BRIDGE_REDEEM_VAULT_FIELD];

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

  const form = useForm<BridgeRedeemFormData>({
    initialValues: {
      [BRIDGE_REDEEM_AMOUNT_FIELD]: '',
      [BRIDGE_REDEEM_VAULT_FIELD]: '',
      [BRIDGE_REDEEM_MANUAL_VAULT_FIELD]: false,
      [BRIDGE_REDEEM_PREMIUM_VAULT_FIELD]: false
    },
    validationSchema: bridgeRedeemSchema({ [BRIDGE_REDEEM_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    showErrorMessages: !transaction.isLoading
  });

  const handleToggleSelectVault = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setPremiumRedeem(isChecked);

    // toggle off premium redeem if user tries to manually select a vault
    if (isChecked && form.values[BRIDGE_REDEEM_PREMIUM_VAULT_FIELD]) {
      return form.setFieldValue(BRIDGE_REDEEM_PREMIUM_VAULT_FIELD, false, false);
    }

    // make vault select field untouched
    if (!isChecked) {
      return form.setFieldTouched(BRIDGE_REDEEM_VAULT_FIELD, false, true);
    }
  };

  const handleTogglePremiumVault = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (!isChecked || !form.values[BRIDGE_REDEEM_MANUAL_VAULT_FIELD]) return;

    // reset manual select vault switch and select. Also enforces premium switch true
    form.resetForm({
      values: {
        ...form.values,
        [BRIDGE_REDEEM_PREMIUM_VAULT_FIELD]: isChecked,
        [BRIDGE_REDEEM_MANUAL_VAULT_FIELD]: false,
        [BRIDGE_REDEEM_VAULT_FIELD]: ''
      },
      touched: {
        ...form.touched,
        [BRIDGE_REDEEM_VAULT_FIELD]: false
      },
      errors: {
        ...form.errors,
        [BRIDGE_REDEEM_MANUAL_VAULT_FIELD]: undefined,
        [BRIDGE_REDEEM_VAULT_FIELD]: undefined
      }
    });
  };

  const handleChangeIssueAmount = (e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const handleVaultSelectionChange = (key: Key) => {
    form.setFieldValue(BRIDGE_REDEEM_VAULT_FIELD, key, true);
  };

  const monetaryAmount = newSafeMonetaryAmount(amount || 0, WRAPPED_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const bridgeFee = monetaryAmount.mul(data.feeRate.toBig());

  const debouncedMonetaryAmount = newSafeMonetaryAmount(debouncedAmount || 0, WRAPPED_TOKEN, true);
  const availableVaults = getAvailableVaults(debouncedMonetaryAmount);

  const totalFees = bridgeFee.add(data.currentInclusionFee);

  const totalAmount = monetaryAmount.gte(totalFees)
    ? monetaryAmount.sub(totalFees)
    : newMonetaryAmount(0, WRAPPED_TOKEN);
  const totalAmountUSD = totalAmount
    ? convertMonetaryAmountToValueInUSD(totalAmount, getTokenPrice(prices, totalAmount.currency.ticker)?.usd) || 0
    : 0;

  const compensationAmount =
    monetaryAmount.isZero() && isPremiumReddem ? getCompensationAmount(monetaryAmount) : undefined;
  const compensationAmountUSD = compensationAmount
    ? convertMonetaryAmountToValueInUSD(
        compensationAmount,
        getTokenPrice(prices, compensationAmount.currency.ticker)?.usd
      ) || 0
    : 0;

  const isSelectingVault = form.values[BRIDGE_REDEEM_MANUAL_VAULT_FIELD];

  const isBtnDisabled = isFormDisabled(form);

  const hasPremiumRedeemVaults = data.premiumRedeemVaults.size > 0;

  const hasEnoughtGovernance = governanceBalance.gte(TRANSACTION_FEE_AMOUNT);

  return (
    <>
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing4'>
              <IssueLimitsCard title='Max redeembale' singleRequestLimit={currentRequestLimit} />
              <TokenInput
                placeholder='0.00'
                label='Amount'
                ticker={WRAPPED_TOKEN.ticker}
                valueUSD={amountUSD}
                {...mergeProps(form.getFieldProps(BRIDGE_REDEEM_AMOUNT_FIELD), { onChange: handleChangeIssueAmount })}
              />
              <SelectVaultCard
                isSelectingVault={isSelectingVault}
                availableVaults={availableVaults}
                switchProps={mergeProps(form.getFieldProps(BRIDGE_REDEEM_MANUAL_VAULT_FIELD), {
                  onChange: handleToggleSelectVault
                })}
                selectProps={{
                  onSelectionChange: handleVaultSelectionChange,
                  ...form.getFieldProps(BRIDGE_REDEEM_VAULT_FIELD)
                }}
              />
              {hasPremiumRedeemVaults && (
                <PremiumRedeemCard
                  isPremiumReddem={isPremiumReddem}
                  switchProps={mergeProps(form.getFieldProps(BRIDGE_REDEEM_PREMIUM_VAULT_FIELD), {
                    onChange: handleTogglePremiumVault
                  })}
                />
              )}
              <Input
                placeholder='Enter your BTC address'
                label='BTC Adress'
                padding={{ top: 'spacing5', bottom: 'spacing5' }}
                {...mergeProps(form.getFieldProps(BRIDGE_REDEEM_ADDRESS))}
              />
            </Flex>
            <Flex direction='column' gap='spacing4'>
              <TransactionDetails
                totalAmount={totalAmount}
                totalAmountUSD={totalAmountUSD}
                totalTicker='BTC'
                compensationAmount={compensationAmount}
                compensationAmountUSD={compensationAmountUSD}
                bridgeFee={bridgeFee}
                bitcoinNetworkFee={data.currentInclusionFee}
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

export { RedeemForm };
export type { RedeemFormProps };
