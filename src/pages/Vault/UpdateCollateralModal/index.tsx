
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

const getButtonVariant = (status: CollateralUpdateStatus): string => {
  switch (status) {
  case CollateralUpdateStatus.Increase:
    return 'primary';
  case CollateralUpdateStatus.Decrease:
    return 'default';
  default:
    return '';
  }
};

enum CollateralUpdateStatus {
  Hidden,
  Increase,
  Decrease
}

const COLLATERAL = 'collateral';

type UpdateCollateralFormData = {
  [COLLATERAL]: string;
};

interface Props {
  onClose: () => void;
  status: CollateralUpdateStatus;
}

const UpdateCollateralModal = ({
  onClose,
  status
}: Props): JSX.Element => {
  const {
    bridgeLoaded,
    vaultClientLoaded,
    address,
    collateralTokenBalance
  } = useSelector((state: StoreType) => state.general);
  const {
    register,
    handleSubmit,
    errors
  } = useForm<UpdateCollateralFormData>();
  // Denoted in collateral token
  const currentCollateral = useSelector((state: StoreType) => state.vault.collateral);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const focusRef = React.useRef(null);

  // Denoted in collateral token
  const [newCollateral, setNewCollateral] = React.useState(currentCollateral);
  // Denoted in collateral token
  const [newCollateralization, setNewCollateralization] = React.useState('∞');
  const [currentButtonText, setCurrentButtonText] = React.useState('');
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
    setNewCollateralization('');
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
      if (status === CollateralUpdateStatus.Increase) {
        newCollateral = newCollateral.add(parsedValue);
      } else if (status === CollateralUpdateStatus.Decrease) {
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

  const getStatusText = (status: CollateralUpdateStatus): string => {
    switch (status) {
    case CollateralUpdateStatus.Increase:
      if (currentButtonText !== t('vault.deposit_collateral')) {
        setCurrentButtonText(t('vault.deposit_collateral'));
      }
      return t('vault.deposit_collateral');
    case CollateralUpdateStatus.Decrease:
      if (currentButtonText !== t('vault.withdraw_collateral')) {
        setCurrentButtonText(t('vault.withdraw_collateral'));
      }
      return t('vault.withdraw_collateral');
    default:
      return currentButtonText || '';
    }
  };

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

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={status !== CollateralUpdateStatus.Hidden}
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
            'mb-4'
          )}>
          {getStatusText(status)}
        </InterlayModalTitle>
        <CloseIconButton
          ref={focusRef}
          onClick={onClose} />
        <form
          onSubmit={onSubmit}
          className={clsx(
            'space-y-4'
          )}>
          <p>
            {t('vault.current_total_collateral', {
              currentCollateral: displayMonetaryAmount(currentCollateral),
              collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
            })}
          </p>
          <p>
            {t('vault.new_total_collateral')}
          </p>
          <div>
            <NumberInput
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
            style={{ display: 'flex' }}
            className='mx-auto'
            color={getButtonVariant(status)}
            disabled={!isCollateralUpdateAllowed}
            pending={isUpdatePending}>
            {status === CollateralUpdateStatus.Increase ?
              t('vault.deposit_collateral') : t('vault.withdraw_collateral')}
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
