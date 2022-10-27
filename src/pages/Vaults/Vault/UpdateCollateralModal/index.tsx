import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { chain } from '@react-aria/utils';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { updateCollateralAction, updateCollateralizationAction } from '@/common/actions/vault.actions';
import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatPercentage } from '@/common/utils/utils';
import CloseIconButton from '@/components/buttons/CloseIconButton';
import InterlayDefaultContainedButton from '@/components/buttons/InterlayDefaultContainedButton';
import TokenField from '@/components/TokenField';
import InterlayModal, { InterlayModalInnerWrapper, InterlayModalTitle } from '@/components/UI/InterlayModal';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

enum CollateralUpdateStatus {
  Close,
  Deposit,
  Withdraw
}

const COLLATERAL_TOKEN_AMOUNT = 'collateral-token-amount';
type UpdateCollateralFormData = {
  [COLLATERAL_TOKEN_AMOUNT]: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  collateralUpdateStatus: CollateralUpdateStatus;
  vaultAddress: string;
  hasLockedBTC: boolean;
  collateralToken: CollateralCurrencyExt;
  collateralTokenAmount: MonetaryAmount<CollateralCurrencyExt>;
}

const UpdateCollateralModal = ({
  open,
  onClose,
  collateralUpdateStatus,
  vaultAddress,
  hasLockedBTC,
  collateralToken,
  collateralTokenAmount: currentTotalCollateralTokenAmount
}: Props): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const prices = useGetPrices();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    resetField
  } = useForm<UpdateCollateralFormData>({
    mode: 'onChange'
  });
  const strCollateralTokenAmount = watch(COLLATERAL_TOKEN_AMOUNT) || '0';

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const focusRef = React.useRef(null);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();

  const vaultId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, vaultAddress);

  const {
    isIdle: requiredCollateralTokenAmountIdle,
    isLoading: requiredCollateralTokenAmountLoading,
    data: requiredCollateralTokenAmount,
    error: requiredCollateralTokenAmountError
  } = useQuery<MonetaryAmount<CollateralCurrencyExt>, Error>(
    [GENERIC_FETCHER, 'vaults', 'getRequiredCollateralForVault', vaultId, collateralToken],
    genericFetcher<MonetaryAmount<CollateralCurrencyExt>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(requiredCollateralTokenAmountError);

  const { isLoading: isBalancesLoading, data: balances } = useGetBalances();

  const collateralTokenAmount = newMonetaryAmount(
    strCollateralTokenAmount,
    collateralToken,
    true
  ) as MonetaryAmount<CollateralCurrencyExt>;
  let newCollateralTokenAmount: MonetaryAmount<CollateralCurrencyExt>;
  let labelText;
  let collateralUpdateStatusText: string;
  if (collateralUpdateStatus === CollateralUpdateStatus.Deposit) {
    collateralUpdateStatusText = t('vault.deposit_collateral');
    newCollateralTokenAmount = currentTotalCollateralTokenAmount.add(collateralTokenAmount);
    labelText = 'Deposit Collateral';
  } else if (collateralUpdateStatus === CollateralUpdateStatus.Withdraw) {
    collateralUpdateStatusText = t('vault.withdraw_collateral');
    newCollateralTokenAmount = currentTotalCollateralTokenAmount.sub(collateralTokenAmount);
    labelText = 'Withdraw Collateral';
  } else {
    throw new Error('Something went wrong!');
  }

  const {
    isIdle: vaultCollateralizationIdle,
    isLoading: vaultCollateralizationLoading,
    data: vaultCollateralization,
    error: vaultCollateralizationError
  } = useQuery<Big, Error>(
    [GENERIC_FETCHER, 'vaults', 'getVaultCollateralization', vaultId, collateralToken, newCollateralTokenAmount],
    genericFetcher<Big>(),
    {
      enabled: bridgeLoaded && hasLockedBTC
    }
  );
  useErrorHandler(vaultCollateralizationError);

  const handleClose = chain(() => resetField(COLLATERAL_TOKEN_AMOUNT), onClose);

  const onSubmit = async (data: UpdateCollateralFormData) => {
    if (!bridgeLoaded) return;

    try {
      setSubmitStatus(STATUSES.PENDING);
      const collateralTokenAmount = newMonetaryAmount(
        data[COLLATERAL_TOKEN_AMOUNT],
        collateralToken,
        true
      ) as MonetaryAmount<CollateralCurrencyExt>;
      if (collateralUpdateStatus === CollateralUpdateStatus.Deposit) {
        await window.bridge.vaults.depositCollateral(collateralTokenAmount);
      } else if (collateralUpdateStatus === CollateralUpdateStatus.Withdraw) {
        await window.bridge.vaults.withdrawCollateral(collateralTokenAmount);
      } else {
        throw new Error('Something went wrong!');
      }

      queryClient.invalidateQueries(['vaultsOverview', vaultAddress, collateralToken.ticker]);

      const balanceLockedCollateral = (await window.bridge.tokens.balance(collateralToken, vaultId)).reserved;
      dispatch(updateCollateralAction(balanceLockedCollateral as MonetaryAmount<CollateralCurrencyExt>));

      if (vaultCollateralization === undefined) {
        dispatch(updateCollateralizationAction('∞'));
      } else {
        // The vault API returns collateralization as a regular number rather than a percentage
        const strVaultCollateralizationPercentage = vaultCollateralization.mul(100).toString();
        dispatch(updateCollateralizationAction(strVaultCollateralizationPercentage));
      }

      toast.success(t('vault.successfully_updated_collateral'));
      setSubmitStatus(STATUSES.RESOLVED);
      handleClose();
    } catch (error) {
      toast.error(error.message);
      handleError(error);
      setSubmitStatus(STATUSES.REJECTED);
    }
  };

  const validateCollateralTokenAmount = (value: string): string | undefined => {
    const collateralTokenAmount = newMonetaryAmount(value || '0', collateralToken, true);

    // Collateral update only allowed if above required collateral
    if (collateralUpdateStatus === CollateralUpdateStatus.Withdraw && requiredCollateralTokenAmount) {
      const maxWithdrawableCollateralTokenAmount = currentTotalCollateralTokenAmount.sub(requiredCollateralTokenAmount);

      return collateralTokenAmount.gt(maxWithdrawableCollateralTokenAmount)
        ? t('vault.collateral_below_threshold')
        : undefined;
    }

    if (collateralTokenAmount.lte(newMonetaryAmount(0, collateralToken, true))) {
      return t('vault.collateral_higher_than_0');
    }

    // Represents being less than 1 Planck
    if (collateralTokenAmount.toBig(0).lte(1)) {
      return 'Please enter an amount greater than 1 Planck';
    }

    const collateralBalance = balances?.[collateralToken.ticker];

    if (collateralBalance && collateralTokenAmount.gt(collateralBalance.transferable)) {
      return t(`Must be less than ${collateralToken.ticker} balance!`);
    }

    if (!bridgeLoaded) {
      return 'Bridge must be loaded!';
    }

    return undefined;
  };

  const renderSubmitButton = () => {
    const initializing =
      requiredCollateralTokenAmountIdle ||
      requiredCollateralTokenAmountLoading ||
      isBalancesLoading ||
      (vaultCollateralizationIdle && hasLockedBTC) ||
      vaultCollateralizationLoading;
    const buttonText = initializing ? 'Loading...' : collateralUpdateStatusText;

    return (
      <InterlayDefaultContainedButton
        type='submit'
        className={clsx('!flex', 'mx-auto')}
        disabled={initializing}
        pending={submitStatus === STATUSES.PENDING}
      >
        {buttonText}
      </InterlayDefaultContainedButton>
    );
  };

  const renderNewCollateralizationLabel = () => {
    if (vaultCollateralizationLoading || !vaultCollateralization) {
      // TODO: should use skeleton loaders
      return '-';
    }

    if (!hasLockedBTC) {
      return '∞';
    }

    if (vaultCollateralization.mul(100).gt(1000)) {
      return `more than ${formatPercentage(1000, { minimumFractionDigits: 0 })}`;
    }

    return formatPercentage(vaultCollateralization.mul(100).toNumber());
  };

  const getMinRequiredCollateralTokenAmount = () => {
    if (requiredCollateralTokenAmountIdle || requiredCollateralTokenAmountLoading) {
      return '-';
    }

    if (requiredCollateralTokenAmount === undefined) {
      throw new Error('Something went wrong');
    }
    return displayMonetaryAmount(requiredCollateralTokenAmount);
  };

  const getMaxWithdrawableCollateralTokenAmount = () => {
    if (requiredCollateralTokenAmountIdle || requiredCollateralTokenAmountLoading) {
      return '-';
    }

    if (requiredCollateralTokenAmount === undefined) {
      throw new Error('Something went wrong');
    }

    const maxWithdrawableCollateralTokenAmount = currentTotalCollateralTokenAmount.sub(requiredCollateralTokenAmount);
    return displayMonetaryAmount(maxWithdrawableCollateralTokenAmount);
  };

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={handleClose}>
      <InterlayModalInnerWrapper className={clsx('p-6', 'max-w-lg')}>
        <InterlayModalTitle as='h3' className={clsx('text-lg', 'font-medium', 'mb-6')}>
          {collateralUpdateStatusText}
        </InterlayModalTitle>
        <CloseIconButton ref={focusRef} onClick={handleClose} />
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <p>
            {t('vault.current_total_collateral', {
              currentCollateral: displayMonetaryAmount(currentTotalCollateralTokenAmount),
              collateralTokenSymbol: collateralToken.ticker
            })}
          </p>
          <p>
            {t('vault.minimum_required_collateral', {
              currentCollateral: getMinRequiredCollateralTokenAmount(),
              collateralTokenSymbol: collateralToken.ticker
            })}
          </p>
          <p>
            {t('vault.maximum_withdrawable_collateral', {
              currentCollateral: getMaxWithdrawableCollateralTokenAmount(),
              collateralTokenSymbol: collateralToken.ticker
            })}
          </p>
          <div className='space-y-1.5'>
            <label htmlFor={COLLATERAL_TOKEN_AMOUNT} className='text-sm'>
              {labelText}
            </label>
            <TokenField
              id={COLLATERAL_TOKEN_AMOUNT}
              label={collateralToken.ticker}
              min={0}
              {...register(COLLATERAL_TOKEN_AMOUNT, {
                required: {
                  value: true,
                  message: t('vault.collateral_is_required')
                },
                validate: (value) => validateCollateralTokenAmount(value)
              })}
              approxUSD={`≈ ${displayMonetaryAmountInUSDFormat(
                collateralTokenAmount,
                getTokenPrice(prices, collateralToken.ticker)?.usd
              )}`}
              error={!!errors[COLLATERAL_TOKEN_AMOUNT]}
              helperText={errors[COLLATERAL_TOKEN_AMOUNT]?.message}
            />
          </div>
          <p>
            {t('vault.new_collateralization')}
            &nbsp;
            {renderNewCollateralizationLabel()}
          </p>
          {renderSubmitButton()}
        </form>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export { CollateralUpdateStatus };

// TODO: `withErrorBoundary` does not work on modals
export default UpdateCollateralModal;
