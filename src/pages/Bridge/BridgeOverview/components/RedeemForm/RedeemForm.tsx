import { getRedeemRequestsFromExtrinsicResult, newMonetaryAmount, Redeem } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
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
  BRIDGE_REDEEM_CUSTOM_VAULT_FIELD,
  BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH,
  BRIDGE_REDEEM_PREMIUM_VAULT_FIELD,
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

const getRequestLimit = (
  redeemLimit: MonetaryAmount<Currency>,
  selectedVault?: BridgeVaultData,
  predeemRedeemLimit?: MonetaryAmount<Currency>,
  isPremiumReddem?: boolean
) => {
  if (selectedVault) {
    return selectedVault.amount;
  }

  if (isPremiumReddem && predeemRedeemLimit) {
    return predeemRedeemLimit;
  }

  return redeemLimit;
};

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

  const [redeemRequest, setRedeemRequest] = useState<Redeem>();

  const [isPremiumReddem, setPremiumRedeem] = useState(false);

  const [amount, setAmount] = useState<string>();
  const [debouncedAmount, setDecounbedAmount] = useState<string>();

  useDebounce(() => setDecounbedAmount(amount), 500, [amount]);

  const [selectedVault, setSelectedVault] = useState<BridgeVaultData>();

  const { data: vaultsData, getAvailableVaults } = useGetVaults(BridgeActions.REDEEM);

  const debouncedMonetaryAmount = newSafeBitcoinAmount(debouncedAmount || 0);
  const availableVaults = getAvailableVaults(debouncedMonetaryAmount);
  const vaults = availableVaults?.length ? availableVaults : vaultsData?.list;

  const transaction = useTransaction(Transaction.REDEEM_REQUEST, {
    onSuccess: async (result) => {
      try {
        const [redeemRequest] = await getRedeemRequestsFromExtrinsicResult(window.bridge, result.data);

        setRedeemRequest(redeemRequest);
      } catch (e: any) {
        transaction.reject(e);
      }

      setAmount(undefined);
      setDecounbedAmount(undefined);
      form.resetForm();
    },
    showSuccessModal: false
  });

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const assetBalance = getAvailableBalance(WRAPPED_TOKEN.ticker) || newMonetaryAmount(0, WRAPPED_TOKEN);

  const currentRequestLimit = getRequestLimit(redeemLimit, selectedVault, premium?.redeemLimit, isPremiumReddem);
  const redeemBalance = assetBalance.gt(currentRequestLimit) ? currentRequestLimit : assetBalance;

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: redeemBalance,
    minAmount: dustValue
  };

  const handleSubmit = async (values: BridgeRedeemFormData) => {
    const amount = values[BRIDGE_REDEEM_AMOUNT_FIELD];
    const btcAddress = values[BRIDGE_REDEEM_ADDRESS];

    if (!vaultsData || !amount || !btcAddress) return;

    const monetaryAmount = newMonetaryAmount(amount, WRAPPED_TOKEN, true);

    const isPremiumReddem = values[BRIDGE_REDEEM_PREMIUM_VAULT_FIELD];

    const availableVaults = getAvailableVaults(monetaryAmount, isPremiumReddem);

    if (!availableVaults) return;

    const vaultId = values[BRIDGE_REDEEM_CUSTOM_VAULT_FIELD];

    let vault: BridgeVaultData | undefined;

    // If custom vault was select, try to find it in the data
    if (vaultId) {
      vault = availableVaults.find((item) => item.id === vaultId);
    }

    // If no vault provided nor the custom vault wasn't found (unlikely), choose random vault
    if (!vault) {
      vault = getRandomArrayElement(availableVaults);
    }

    transaction.execute(monetaryAmount, btcAddress, vault.vaultId);
  };

  const form = useForm<BridgeRedeemFormData>({
    initialValues: {
      [BRIDGE_REDEEM_AMOUNT_FIELD]: '',
      [BRIDGE_REDEEM_CUSTOM_VAULT_FIELD]: '',
      [BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH]: false,
      [BRIDGE_REDEEM_PREMIUM_VAULT_FIELD]: false,
      [BRIDGE_REDEEM_ADDRESS]: ''
    },
    validationSchema: bridgeRedeemSchema({ [BRIDGE_REDEEM_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    showErrorMessages: !transaction.isLoading
  });

  const handleToggleCustomVault = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    // make vault select field untouched
    if (!isChecked) {
      return form.setFieldTouched(BRIDGE_REDEEM_CUSTOM_VAULT_FIELD, false, true);
    }
  };

  const handleTogglePremiumVault = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setPremiumRedeem(isChecked);

    const isSelectingVault = form.values[BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH];

    // Do not continue if premium is unchecked and is not manually selecting vault
    if (!isChecked || !isSelectingVault) return;

    const premiumVaults = getAvailableVaults(monetaryAmount, true);

    const selectedVault = form.values[BRIDGE_REDEEM_CUSTOM_VAULT_FIELD];

    if (!selectedVault) return;

    const isSelectedVaultValid = premiumVaults?.find((vault) => vault.id === selectedVault);

    if (isSelectedVaultValid) return;

    form.setFieldValue(BRIDGE_REDEEM_CUSTOM_VAULT_FIELD, '', true);
  };

  const handleChangeIssueAmount = (e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const handleVaultSelectionChange = (key: Key) => {
    form.setFieldValue(BRIDGE_REDEEM_CUSTOM_VAULT_FIELD, key, true);

    if (!vaults) return;

    const vault = vaults.find((item) => item.id === key);

    setSelectedVault(vault);
  };

  const monetaryAmount = newSafeMonetaryAmount(amount || 0, WRAPPED_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const bridgeFee = monetaryAmount.mul(feeRate);

  const totalFees = bridgeFee.add(currentInclusionFee);

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

  const isSelectingVault = form.values[BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH];

  const isBtnDisabled = isFormDisabled(form);

  const hasPremiumRedeemFeature = premium;

  const hasEnoughtGovernance = governanceBalance.gte(TRANSACTION_FEE_AMOUNT);

  return (
    <>
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing4'>
              <RequestLimitsCard title={t('bridge.max_redeembale')} singleRequestLimit={redeemLimit} />
              <TokenInput
                placeholder='0.00'
                label={t('amount')}
                ticker={WRAPPED_TOKEN.ticker}
                balance={redeemBalance.toString()}
                humanBalance={redeemBalance.toString()}
                balanceLabel={t('available')}
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
                vaults={vaults}
                switchProps={mergeProps(form.getFieldProps(BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH), {
                  onChange: handleToggleCustomVault
                })}
                selectProps={{
                  onSelectionChange: handleVaultSelectionChange,
                  ...form.getFieldProps(BRIDGE_REDEEM_CUSTOM_VAULT_FIELD)
                }}
              />
              <Input
                placeholder={t('enter_btc_address')}
                label={t('btc_address')}
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
                {hasEnoughtGovernance
                  ? t('redeem')
                  : t('insufficient_token_balance', { token: GOVERNANCE_TOKEN.ticker })}
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
