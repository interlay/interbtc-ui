
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import {
  roundTwoDecimals,
  newMonetaryAmount
} from '@interlay/interbtc-api';

import ErrorMessage from 'components/ErrorMessage';
import NumberInput from 'components/NumberInput';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import CloseIconButton from 'components/buttons/CloseIconButton';
import InterlayModal, {
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  COLLATERAL_TOKEN,
  COLLATERAL_TOKEN_SYMBOL
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';
import {
  updateCollateralAction,
  updateCollateralizationAction
} from 'common/actions/vault.actions';
import { StoreType } from 'common/types/util.types';

enum CollateralUpdateStatus {
  Close,
  Deposit,
  Withdraw
}

const COLLATERAL = 'collateral';
type UpdateCollateralFormData = {
  [COLLATERAL]: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  collateralUpdateStatus: CollateralUpdateStatus;
}

const UpdateCollateralModal = ({
  open,
  onClose,
  collateralUpdateStatus
}: Props): JSX.Element => {
  const {
    bridgeLoaded,
    vaultClientLoaded,
    address,
    collateralTokenBalance
  } = useSelector((state: StoreType) => state.general);
  // Denoted in collateral token
  const currentCollateral = useSelector((state: StoreType) => state.vault.collateral);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateCollateralFormData>({
    mode: 'onChange'
  });

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const focusRef = React.useRef(null);

  // Denoted in collateral token
  const [newCollateral, setNewCollateral] = React.useState(currentCollateral);
  // Denoted in collateral token
  const [newCollateralization, setNewCollateralization] = React.useState('∞');
  const [isUpdatePending, setUpdatePending] = React.useState(false);
  const [isCollateralUpdateAllowed, setCollateralUpdateAllowed] = React.useState(false);

  const onSubmit = handleSubmit(async () => {
    if (!bridgeLoaded) return;
    if (!vaultClientLoaded) return;

    setUpdatePending(true);
    try {
      if (currentCollateral.gt(newCollateral)) {
        const withdrawAmount = currentCollateral.sub(newCollateral);
        await window.bridge.interBtcApi.vaults.withdrawCollateral(withdrawAmount);
      } else if (currentCollateral.lt(newCollateral)) {
        const depositAmount = newCollateral.sub(currentCollateral);
        await window.bridge.interBtcApi.vaults.depositCollateral(depositAmount);
      } else {
        closeModal();
        return;
      }

      const vaultId = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, address);
      const balanceLockedDOT = await window.bridge.interBtcApi.tokens.balanceLocked(COLLATERAL_TOKEN, vaultId);
      dispatch(updateCollateralAction(balanceLockedDOT));
      let collateralization;
      try {
        collateralization = new Big(parseFloat(newCollateralization) / 100);
      } catch {
        collateralization = undefined;
      }
      dispatch(updateCollateralizationAction(collateralization?.mul(100).toString()));

      toast.success(t('vault.successfully_updated_collateral'));
      closeModal();
    } catch (error) {
      toast.error(error.toString());
    }
    setUpdatePending(false);
  });

  const closeModal = () => {
    onClose();
  };

  // ray test touch <
  const onChange = async (event: React.SyntheticEvent) => {
    try {
      const value = (event.target as HTMLInputElement).value;
      if (value === '' || !bridgeLoaded || Number(value) <= 0 || isNaN(Number(value))) {
        setCollateralUpdateAllowed(false);
        return;
      }
      const parsedValue = newMonetaryAmount(value, COLLATERAL_TOKEN, true);
      if (parsedValue.toBig(parsedValue.currency.rawBase).lte(1)) {
        throw new Error('Please enter an amount greater than 1 Planck');
      }

      // Decide if we withdraw or add collateral
      if (!currentCollateral) {
        throw new Error('Couldn\'t fetch current vault collateral');
      }

      let newCollateral = currentCollateral;
      if (collateralUpdateStatus === CollateralUpdateStatus.Deposit) {
        newCollateral = newCollateral.add(parsedValue);
      } else if (collateralUpdateStatus === CollateralUpdateStatus.Withdraw) {
        newCollateral = newCollateral.sub(parsedValue);
      }
      setNewCollateral(newCollateral);

      const vaultId = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, address);
      const requiredCollateral =
        await window.bridge.interBtcApi.vaults.getRequiredCollateralForVault(vaultId, COLLATERAL_TOKEN);

      // Collateral update only allowed if above required collateral
      const allowed = newCollateral.gte(requiredCollateral);
      setCollateralUpdateAllowed(allowed);

      // Get the updated collateralization
      const newCollateralization =
        await window.bridge.interBtcApi.vaults.getVaultCollateralization(vaultId, newCollateral);
      if (newCollateralization === undefined) {
        setNewCollateralization('∞');
      } else {
        // The vault API returns collateralization as a regular number rather than a percentage
        setNewCollateralization(newCollateralization.mul(100).toString());
      }
    } catch (error) {
      console.log('[UpdateCollateralModal onChange] error.message => ', error.message);
    }
  };
  // ray test touch >

  const validateAmount = (value: string): string | undefined => {
    const collateralTokenAmount = newMonetaryAmount(value, COLLATERAL_TOKEN, true);
    if (collateralTokenAmount.lte(newMonetaryAmount(0, COLLATERAL_TOKEN, true))) {
      return t('vault.collateral_higher_than_0');
    }

    if (collateralTokenAmount.gt(collateralTokenBalance)) {
      return t(`Amount must be less than ${COLLATERAL_TOKEN_SYMBOL} balance!`);
    }

    return undefined;
  };

  let collateralUpdateStatusText;
  if (collateralUpdateStatus === CollateralUpdateStatus.Deposit) {
    collateralUpdateStatusText = t('vault.deposit_collateral');
  } else if (collateralUpdateStatus === CollateralUpdateStatus.Withdraw) {
    collateralUpdateStatusText = t('vault.withdraw_collateral');
  } else {
    throw new Error('Something went wrong!');
  }

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={open}
      onClose={closeModal}>
      <InterlayModalInnerWrapper
        className={clsx(
          'p-6',
          'max-w-lg'
        )}>
        <InterlayModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium',
            'mb-6'
          )}>
          {collateralUpdateStatusText}
        </InterlayModalTitle>
        <CloseIconButton
          ref={focusRef}
          onClick={onClose} />
        <form
          onSubmit={onSubmit}
          className='space-y-4'>
          <p>
            {t('vault.current_total_collateral', {
              currentCollateral: displayMonetaryAmount(currentCollateral),
              collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
            })}
          </p>
          <div>
            <label
              htmlFor={COLLATERAL}
              className='text-sm'>
              {t('vault.new_total_collateral')}
            </label>
            <NumberInput
              id={COLLATERAL}
              name={COLLATERAL}
              title={COLLATERAL}
              min={0}
              ref={register({
                required: {
                  value: true,
                  message: t('vault.collateral_is_required')
                },
                validate: value => validateAmount(value)
              })}
              onChange={onChange}>
            </NumberInput>
            <ErrorMessage>
              {errors[COLLATERAL]?.message}
            </ErrorMessage>
          </div>
          <p>
            {t('vault.new_collateralization')}
            &nbsp;
            {
              newCollateralization === '∞' ?
                newCollateralization :
                Number(newCollateralization) > 1000 ?
                  'more than 1000%' :
                  roundTwoDecimals(newCollateralization || '0') + '%'
            }
          </p>
          <InterlayDefaultContainedButton
            type='submit'
            className={clsx(
              '!flex',
              'mx-auto'
            )}
            disabled={!isCollateralUpdateAllowed}
            pending={isUpdatePending}>
            {collateralUpdateStatusText}
          </InterlayDefaultContainedButton>
        </form>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export {
  CollateralUpdateStatus
};

export default UpdateCollateralModal;
