import { getRedeemRequestsFromExtrinsicResult, newMonetaryAmount, Redeem } from '@interlay/interbtc-api';
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
  BRIDGE_REDEEM_MANUAL_VAULT_SWITCH,
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

import { LegacyRedeemModal } from '../LegacyRedeemModal';
import { RequestLimitsCard } from '../RequestLimitsCard';
import { SelectVaultCard } from '../SelectVaultCard';
import { TransactionDetails } from '../TransactionDetails';
import { PremiumRedeemCard } from './PremiumRedeemCard';

type RedeemFormProps = RedeemData;

const RedeemForm = ({
  currentInclusionFee,
  dustValue,
  feeRate,
  redeemLimit,
  premium
}: RedeemFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getBalance, getAvailableBalance } = useGetBalances();
  const { getCompensationAmount } = useGetRedeemData();

  const { data: vaultsData, getAvailableVaults } = useGetVaults(BridgeActions.REDEEM);

  const [redeemRequest, setRedeemRequest] = useState<Redeem>();

  const [amount, setAmount] = useState<string>();
  const [debouncedAmount, setDecounbedAmount] = useState<string>();

  const [isPremiumReddem, setPremiumRedeem] = useState(false);

  const transaction = useTransaction(Transaction.REDEEM_REQUEST, {
    onSuccess: async (result) => {
      try {
        const [redeemRequest] = await getRedeemRequestsFromExtrinsicResult(window.bridge, result.data);

        setRedeemRequest(redeemRequest);
      } catch (e: any) {
        transaction.reject(e);
      }

      form.resetForm();
    },
    showSuccessModal: false
  });

  useDebounce(() => setDecounbedAmount(amount), 500, [amount]);

  const currentRequestLimit = isPremiumReddem && premium ? premium.redeemLimit : redeemLimit;

  useDebounce(
    () => {
      const isSelectingVault = form.values[BRIDGE_REDEEM_MANUAL_VAULT_SWITCH];

      if (!amount || !isSelectingVault) return;

      const monetaryAmount = newSafeBitcoinAmount(amount);
      const isAmountOverRequestLimit = monetaryAmount.gt(currentRequestLimit);

      if (isAmountOverRequestLimit) {
        form.resetForm({
          values: {
            ...form.values,
            [BRIDGE_REDEEM_MANUAL_VAULT_SWITCH]: true,
            [BRIDGE_REDEEM_VAULT_FIELD]: ''
          },
          touched: {
            ...form.touched,
            [BRIDGE_REDEEM_VAULT_FIELD]: false
          },
          errors: {
            ...form.errors,
            [BRIDGE_REDEEM_MANUAL_VAULT_SWITCH]: undefined,
            [BRIDGE_REDEEM_VAULT_FIELD]: undefined
          }
        });
      }
    },
    500,
    [amount, currentRequestLimit]
  );

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const assetBalance = getAvailableBalance(WRAPPED_TOKEN.ticker) || newMonetaryAmount(0, WRAPPED_TOKEN);

  const redeemBalance = assetBalance.gt(currentRequestLimit) ? currentRequestLimit : assetBalance;

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: redeemBalance,
    minAmount: dustValue,
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const handleSubmit = async (values: BridgeRedeemFormData) => {
    const amount = values[BRIDGE_REDEEM_AMOUNT_FIELD];
    const btcAddress = values[BRIDGE_REDEEM_ADDRESS];

    if (!vaultsData || !amount || !btcAddress) return;

    const monetaryAmount = newMonetaryAmount(amount, WRAPPED_TOKEN, true);

    const isPremiumReddem = values[BRIDGE_REDEEM_PREMIUM_VAULT_FIELD];

    const availableVaults = getAvailableVaults(monetaryAmount, isPremiumReddem);

    if (!availableVaults) return;

    const vaultId = values[BRIDGE_REDEEM_VAULT_FIELD];

    let vault: BridgeVaultData | undefined;

    // If custom vault was select, try to find it in the data
    if (vaultId) {
      vault = availableVaults.find((item) => item.id.toString() === vaultId);
    }

    // If no vault provided nor the custom vault wasn't found (unlikely), choose random vault
    if (!vault) {
      vault = getRandomArrayElement(availableVaults);
    }

    transaction.execute(monetaryAmount, btcAddress, vaultId);
  };

  const form = useForm<BridgeRedeemFormData>({
    initialValues: {
      [BRIDGE_REDEEM_AMOUNT_FIELD]: '',
      [BRIDGE_REDEEM_VAULT_FIELD]: '',
      [BRIDGE_REDEEM_MANUAL_VAULT_SWITCH]: false,
      [BRIDGE_REDEEM_PREMIUM_VAULT_FIELD]: false,
      [BRIDGE_REDEEM_ADDRESS]: ''
    },
    validationSchema: bridgeRedeemSchema({ [BRIDGE_REDEEM_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    showErrorMessages: !transaction.isLoading
  });

  const handleToggleSelectVault = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    // make vault select field untouched
    if (!isChecked) {
      return form.setFieldTouched(BRIDGE_REDEEM_VAULT_FIELD, false, true);
    }
  };

  const handleTogglePremiumVault = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setPremiumRedeem(isChecked);

    const isSelectingVault = form.values[BRIDGE_REDEEM_MANUAL_VAULT_SWITCH];

    // Do not continue if premium is unchecked and is not manually selecting vault
    if (!isChecked || !isSelectingVault) return;

    const premiumVaults = getAvailableVaults(monetaryAmount, true);

    const selectedVault = form.values[BRIDGE_REDEEM_VAULT_FIELD];

    if (!selectedVault) return;

    const isSelectedVaultValid = premiumVaults?.find((vault) => vault.id === selectedVault);

    if (isSelectedVaultValid) return;

    form.setFieldValue(BRIDGE_REDEEM_VAULT_FIELD, '', true);
  };

  const handleChangeIssueAmount = (e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const handleVaultSelectionChange = (key: Key) => {
    form.setFieldValue(BRIDGE_REDEEM_VAULT_FIELD, key, true);
  };

  const monetaryAmount = newSafeMonetaryAmount(amount || 0, WRAPPED_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const bridgeFee = monetaryAmount.mul(feeRate);

  const debouncedMonetaryAmount = newSafeMonetaryAmount(debouncedAmount || 0, WRAPPED_TOKEN, true);
  const availableVaults = getAvailableVaults(debouncedMonetaryAmount, isPremiumReddem);

  const totalFees = bridgeFee.add(currentInclusionFee);

  const totalAmount = monetaryAmount.gte(totalFees)
    ? monetaryAmount.sub(totalFees)
    : newMonetaryAmount(0, WRAPPED_TOKEN);
  const totalAmountUSD = totalAmount
    ? convertMonetaryAmountToValueInUSD(totalAmount, getTokenPrice(prices, totalAmount.currency.ticker)?.usd) || 0
    : 0;

  const compensationAmount = newMonetaryAmount(12, GOVERNANCE_TOKEN);
  console.log(getCompensationAmount);
  // monetaryAmount.isZero() && isPremiumReddem ? getCompensationAmount(monetaryAmount) : undefined;
  const compensationAmountUSD = compensationAmount
    ? convertMonetaryAmountToValueInUSD(
        compensationAmount,
        getTokenPrice(prices, compensationAmount.currency.ticker)?.usd
      ) || 0
    : 0;

  const isSelectingVault = form.values[BRIDGE_REDEEM_MANUAL_VAULT_SWITCH];

  const isBtnDisabled = isFormDisabled(form);

  const hasPremiumRedeemFeature = premium;

  const hasEnoughtGovernance = governanceBalance.gte(TRANSACTION_FEE_AMOUNT);

  return (
    <>
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing4'>
              <RequestLimitsCard title='Max redeembale' singleRequestLimit={currentRequestLimit} />
              <TokenInput
                placeholder='0.00'
                label='Amount'
                ticker={WRAPPED_TOKEN.ticker}
                balance={redeemBalance.toString()}
                humanBalance={redeemBalance.toString()}
                balanceLabel='Available'
                valueUSD={amountUSD}
                {...mergeProps(form.getFieldProps(BRIDGE_REDEEM_AMOUNT_FIELD), { onChange: handleChangeIssueAmount })}
              />
              {hasPremiumRedeemFeature && (
                <PremiumRedeemCard
                  isPremiumReddem={isPremiumReddem}
                  switchProps={mergeProps(form.getFieldProps(BRIDGE_REDEEM_PREMIUM_VAULT_FIELD), {
                    onChange: handleTogglePremiumVault
                  })}
                />
              )}
              <SelectVaultCard
                isSelectingVault={isSelectingVault}
                vaults={availableVaults}
                switchProps={mergeProps(form.getFieldProps(BRIDGE_REDEEM_MANUAL_VAULT_SWITCH), {
                  onChange: handleToggleSelectVault
                })}
                selectProps={{
                  onSelectionChange: handleVaultSelectionChange,
                  ...form.getFieldProps(BRIDGE_REDEEM_VAULT_FIELD)
                }}
              />
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
                bitcoinNetworkFee={currentInclusionFee}
              />
              <AuthCTA
                type='submit'
                disabled={isBtnDisabled || !hasEnoughtGovernance}
                size='large'
                loading={transaction.isLoading}
              >
                {hasEnoughtGovernance ? t('redeem') : `Insufficient ${GOVERNANCE_TOKEN.ticker}`}
              </AuthCTA>
            </Flex>
          </Flex>
        </form>
      </Flex>
      {redeemRequest && (
        <LegacyRedeemModal open={!!redeemRequest} onClose={() => setRedeemRequest(undefined)} request={redeemRequest} />
      )}
    </>
  );
};

export { RedeemForm };
export type { RedeemFormProps };
