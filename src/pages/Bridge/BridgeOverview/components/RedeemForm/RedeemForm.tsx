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
  BRIDGE_REDEEM_VAULT_FIELD,
  BridgeRedeemFormData,
  bridgeRedeemSchema,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { BridgeActions } from '@/types/bridge';
import { getTokenPrice } from '@/utils/helpers/prices';
import { RedeemData } from '@/utils/hooks/api/bridge/use-get-redeem-data';
import { BridgeVaultData, useGetVaults } from '@/utils/hooks/api/bridge/use-get-vaults';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { IssueLimitsCard } from '../BridgeLimitsCard';
import { LegacyIssueModal } from '../LegacyIssueModal';
import { SelectVaultCard } from '../SelectVaultCard';
import { TransactionDetails } from './TransactionDetails';

const isInputOverRequestLimit = (inputAmount: BitcoinAmount, limits: IssueLimits) =>
  inputAmount.gt(limits.singleVaultMaxIssuable);

type RedeemFormProps = { requestLimits: IssueLimits; data: RedeemData };

const RedeemForm = ({ requestLimits, data }: RedeemFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();
  const [issueRequest, setIssueRequest] = useState<Issue>();

  const [amount, setAmount] = useState<string>();
  const [debouncedAmount, setDecounbedAmount] = useState<string>();

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
            [BRIDGE_REDEEM_MANUAL_VAULT_FIELD]: false,
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

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: requestLimits.singleVaultMaxIssuable,
    minAmount: data.dustValue,
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const handleSubmit = async (values: BridgeRedeemFormData) => {
    const amount = values[BRIDGE_REDEEM_AMOUNT_FIELD];

    if (!vaultsData || !amount) return;

    const monetaryAmount = new BitcoinAmount(amount);

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
      [BRIDGE_REDEEM_MANUAL_VAULT_FIELD]: false
    },
    validationSchema: bridgeRedeemSchema({ [BRIDGE_REDEEM_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    showErrorMessages: !transaction.isLoading
  });

  const handleChangeSelectingVault = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      form.setFieldTouched(BRIDGE_REDEEM_VAULT_FIELD, false, true);
    }
  };

  const handleChangeIssueAmount = (e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const handleVaultSelectionChange = (key: Key) => {
    form.setFieldValue(BRIDGE_REDEEM_VAULT_FIELD, key, true);
  };

  const monetaryAmount = newSafeBitcoinAmount(amount || 0);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const debouncedMonetaryAmount = newSafeMonetaryAmount(debouncedAmount || 0, WRAPPED_TOKEN, true);
  const availableVaults = getAvailableVaults(debouncedMonetaryAmount);

  const totalAmount = monetaryAmount.gte(data.feeRate) ? monetaryAmount.sub(data.feeRate) : undefined;
  const totalAmountUSD = totalAmount
    ? convertMonetaryAmountToValueInUSD(totalAmount, getTokenPrice(prices, totalAmount.currency.ticker)?.usd) || 0
    : 0;

  const isSelectingVault = form.values[BRIDGE_REDEEM_MANUAL_VAULT_FIELD];

  const isBtnDisabled = isFormDisabled(form);

  const hasEnoughtGovernance = governanceBalance.gte(TRANSACTION_FEE_AMOUNT);

  return (
    <>
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing4'>
              <IssueLimitsCard title='Max redeembale' singleRequestLimit={requestLimits.singleVaultMaxIssuable} />
              <TokenInput
                placeholder='0.00'
                label='Amount'
                ticker='BTC'
                valueUSD={amountUSD}
                {...mergeProps(form.getFieldProps(BRIDGE_REDEEM_AMOUNT_FIELD), { onChange: handleChangeIssueAmount })}
              />
              <SelectVaultCard
                isSelectingVault={isSelectingVault}
                availableVaults={availableVaults}
                switchProps={mergeProps(form.getFieldProps(BRIDGE_REDEEM_MANUAL_VAULT_FIELD), {
                  onChange: handleChangeSelectingVault
                })}
                selectProps={{
                  onSelectionChange: handleVaultSelectionChange,
                  ...form.getFieldProps(BRIDGE_REDEEM_VAULT_FIELD)
                }}
              />
              <Input
                placeholder='Enter recipient account'
                label='Recipient'
                padding={{ top: 'spacing5', bottom: 'spacing5' }}
                {...mergeProps(form.getFieldProps(BRIDGE_REDEEM_ADDRESS))}
              />
            </Flex>
            <Flex direction='column' gap='spacing4'>
              <TransactionDetails totalAmount={totalAmount} totalAmountUSD={totalAmountUSD} redeemFee={data.feeRate} />
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
