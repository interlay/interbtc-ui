import { CollateralUnit, newMonetaryAmount, roundTwoDecimals } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { updateCollateralAction, updateCollateralizationAction } from '@/common/actions/vault.actions';
import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, getUsdAmount } from '@/common/utils/utils';
import CloseIconButton from '@/components/buttons/CloseIconButton';
import InterlayDefaultContainedButton from '@/components/buttons/InterlayDefaultContainedButton';
import ErrorFallback from '@/components/ErrorFallback';
import TokenField from '@/components/TokenField';
import InterlayModal, { InterlayModalInnerWrapper, InterlayModalTitle } from '@/components/UI/InterlayModal';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import useTokenBalance from '@/services/hooks/use-token-balance';
import { GenericCurrencyValues } from '@/types/currency';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
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
  collateralCurrency: GenericCurrencyValues<CollateralUnit>;
}

const UpdateCollateralModal = ({
  open,
  onClose,
  collateralUpdateStatus,
  vaultAddress,
  hasLockedBTC,
  collateralCurrency
}: Props): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const prices = useGetPrices();

  const currentTotalCollateralTokenAmount = useSelector((state: StoreType) => state.vault.collateral);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
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
  } = useQuery<MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>, Error>(
    [GENERIC_FETCHER, 'vaults', 'getRequiredCollateralForVault', vaultId, collateralCurrency.currency],
    genericFetcher<MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(requiredCollateralTokenAmountError);

  const {
    tokenBalanceIdle: collateralBalanceIdle,
    tokenBalanceLoading: collateralBalanceLoading,
    tokenBalance: collateralBalance
  } = useTokenBalance<CollateralUnit>(collateralCurrency.currency, vaultAddress);

  const collateralTokenAmount = newMonetaryAmount(
    strCollateralTokenAmount,
    collateralCurrency.currency,
    true
  ) as MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  let newCollateralTokenAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
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
    [GENERIC_FETCHER, 'vaults', 'getVaultCollateralization', vaultId, collateralCurrency.id, newCollateralTokenAmount],
    genericFetcher<Big>(),
    {
      enabled: bridgeLoaded && hasLockedBTC
    }
  );
  useErrorHandler(vaultCollateralizationError);

  const onSubmit = async (data: UpdateCollateralFormData) => {
    if (!bridgeLoaded) return;

    try {
      setSubmitStatus(STATUSES.PENDING);
      const collateralTokenAmount = newMonetaryAmount(
        data[COLLATERAL_TOKEN_AMOUNT],
        collateralCurrency.currency,
        true
      ) as MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
      if (collateralUpdateStatus === CollateralUpdateStatus.Deposit) {
        await window.bridge.vaults.depositCollateral(collateralTokenAmount);
      } else if (collateralUpdateStatus === CollateralUpdateStatus.Withdraw) {
        await window.bridge.vaults.withdrawCollateral(collateralTokenAmount);
      } else {
        throw new Error('Something went wrong!');
      }

      const balanceLockedCollateral = (await window.bridge.tokens.balance(collateralCurrency.currency, vaultId))
        .reserved;
      console.log('balanceLockedCollateral', balanceLockedCollateral);
      dispatch(
        updateCollateralAction(balanceLockedCollateral as MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>)
      );

      if (vaultCollateralization === undefined) {
        dispatch(updateCollateralizationAction('∞'));
      } else {
        // The vault API returns collateralization as a regular number rather than a percentage
        const strVaultCollateralizationPercentage = vaultCollateralization.mul(100).toString();
        dispatch(updateCollateralizationAction(strVaultCollateralizationPercentage));
      }

      toast.success(t('vault.successfully_updated_collateral'));
      setSubmitStatus(STATUSES.RESOLVED);
      onClose();
    } catch (error) {
      toast.error(error.message);
      handleError(error);
      setSubmitStatus(STATUSES.REJECTED);
    }
  };

  const validateCollateralTokenAmount = (value: string): string | undefined => {
    const collateralTokenAmount = newMonetaryAmount(value || '0', collateralCurrency.currency, true);

    // Collateral update only allowed if above required collateral
    if (collateralUpdateStatus === CollateralUpdateStatus.Withdraw && requiredCollateralTokenAmount) {
      const maxWithdrawableCollateralTokenAmount = currentTotalCollateralTokenAmount.sub(requiredCollateralTokenAmount);

      return collateralTokenAmount.gt(maxWithdrawableCollateralTokenAmount)
        ? t('vault.collateral_below_threshold')
        : undefined;
    }

    if (collateralTokenAmount.lte(newMonetaryAmount(0, collateralCurrency.currency, true))) {
      return t('vault.collateral_higher_than_0');
    }

    if (collateralTokenAmount.toBig(collateralTokenAmount.currency.rawBase).lte(1)) {
      return 'Please enter an amount greater than 1 Planck';
    }

    if (collateralBalance && collateralTokenAmount.gt(collateralBalance.transferable)) {
      return t(`Must be less than ${collateralCurrency.id} balance!`);
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
      collateralBalanceIdle ||
      collateralBalanceLoading ||
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
    if (vaultCollateralizationLoading) {
      // TODO: should use skeleton loaders
      return '-';
    }

    if (!hasLockedBTC) {
      return '∞';
    }

    // The vault API returns collateralization as a regular number rather than a percentage
    const strVaultCollateralizationPercentage = vaultCollateralization?.mul(100).toString();
    if (Number(strVaultCollateralizationPercentage) > 1000) {
      return 'more than 1000%';
    } else {
      return `${roundTwoDecimals(strVaultCollateralizationPercentage || '0')}%`;
    }
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
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-6', 'max-w-lg')}>
        <InterlayModalTitle as='h3' className={clsx('text-lg', 'font-medium', 'mb-6')}>
          {collateralUpdateStatusText}
        </InterlayModalTitle>
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <p>
            {t('vault.current_total_collateral', {
              currentCollateral: displayMonetaryAmount(currentTotalCollateralTokenAmount),
              collateralTokenSymbol: collateralCurrency.id
            })}
          </p>
          <p>
            {t('vault.minimum_required_collateral', {
              currentCollateral: getMinRequiredCollateralTokenAmount(),
              collateralTokenSymbol: collateralCurrency.id
            })}
          </p>
          <p>
            {t('vault.maximum_withdrawable_collateral', {
              currentCollateral: getMaxWithdrawableCollateralTokenAmount(),
              collateralTokenSymbol: collateralCurrency.id
            })}
          </p>
          <div className='space-y-1.5'>
            <label htmlFor={COLLATERAL_TOKEN_AMOUNT} className='text-sm'>
              {labelText}
            </label>
            <TokenField
              id={COLLATERAL_TOKEN_AMOUNT}
              label={collateralCurrency.id}
              min={0}
              {...register(COLLATERAL_TOKEN_AMOUNT, {
                required: {
                  value: true,
                  message: t('vault.collateral_is_required')
                },
                validate: (value) => validateCollateralTokenAmount(value)
              })}
              approxUSD={`≈ ${getUsdAmount(collateralTokenAmount, getTokenPrice(prices, collateralCurrency.id)?.usd)}`}
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
export default withErrorBoundary(UpdateCollateralModal, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
