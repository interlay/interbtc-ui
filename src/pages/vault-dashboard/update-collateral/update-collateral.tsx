
import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import {
  roundTwoDecimals,
  newMonetaryAmount
} from '@interlay/interbtc-api';

import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import {
  updateCollateralAction,
  updateCollateralizationAction
} from 'common/actions/vault.actions';
import { StoreType } from 'common/types/util.types';

// Commenting because moving this to last line causes 3 "used before it was defined" warnings
// eslint-disable-next-line import/exports-last
export enum CollateralUpdateStatus {
  Hidden,
  Increase,
  Decrease
}

type UpdateCollateralForm = {
  collateral: string;
};

interface Props {
  onClose: () => void;
  status: CollateralUpdateStatus;
}

const UpdateCollateralModal = (props: Props): JSX.Element => {
  const {
    bridgeLoaded,
    vaultClientLoaded,
    address
  } = useSelector((state: StoreType) => state.general);
  const {
    register,
    handleSubmit,
    errors
  } = useForm<UpdateCollateralForm>();
  // Denoted in DOT
  const currentCollateral = useSelector((state: StoreType) => state.vault.collateral);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Denoted in DOT
  const [newCollateral, setNewCollateral] = React.useState(currentCollateral);
  // Denoted in DOT
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
    props.onClose();
    setNewCollateralization('');
  };

  const onChange = async (obj: React.SyntheticEvent) => {
    try {
      const value = (obj.target as HTMLInputElement).value;
      if (value === '' || !bridgeLoaded || Number(value) <= 0 || isNaN(Number(value))) {
        setCollateralUpdateAllowed(false);
        return;
      }
      const parsedValue = newMonetaryAmount(value, COLLATERAL_TOKEN);
      if (parsedValue.toBig(parsedValue.currency.rawBase).lte(1)) {
        throw new Error('Please enter an amount greater than 1 Planck');
      }

      // Decide if we withdraw or add collateral
      if (!currentCollateral) {
        throw new Error('Couldn\'t fetch current vault collateral');
      }

      let newCollateral = currentCollateral;
      if (props.status === CollateralUpdateStatus.Increase) {
        newCollateral = newCollateral.add(parsedValue);
      } else if (props.status === CollateralUpdateStatus.Decrease) {
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

  return (
    <Modal
      show={props.status !== CollateralUpdateStatus.Hidden}
      onHide={closeModal}>
      <form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{getStatusText(props.status)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-12 my-4'>
              {t('vault.current_total_collateral', { currentCollateral })}
            </div>
            <div className='col-12 my-4'>
              {t('vault.new_total_collateral', { newCollateral })}
            </div>
            <div className='col-12 basic-addon'>
              <div className='input-group'>
                <input
                  name='collateral'
                  type='float'
                  className={'form-control custom-input' + (errors.collateral ? ' border-interlayCinnabar' : '')}
                  aria-describedby='basic-addon2'
                  ref={register({
                    required: true,
                    min: 0
                  })}
                  onChange={onChange}>
                </input>
                <div className='input-group-append'>
                  <span
                    className='input-group-text'
                    id='basic-addon2'>
                    DOT
                  </span>
                </div>
              </div>
              {errors.collateral && (
                <div className='mt-0.5 text-interlayConifer'>
                  {errors.collateral.type === 'required' ?
                    t('vault.collateral_is_required') :
                    errors.collateral.message}
                  {errors.collateral.type === 'min' ? t('vault.collateral_higher_than_0') : errors.collateral.message}
                </div>
              )}
            </div>
            <div className='col-12'>
              {t('vault.new_collateralization')}
              {
                // eslint-disable-next-line no-negated-condition
                newCollateralization !== '∞' ?
                  Number(newCollateralization) > 1000 ?
                    ' more than 1000%' :
                    ' ' + roundTwoDecimals(newCollateralization || '0') + '%' :
                  ' ' + newCollateralization
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='row justify-center'>
          <InterlayDefaultContainedButton
            type='submit'
            style={{ display: 'flex' }}
            className='mx-auto'
            color={getButtonVariant(props.status)}
            disabled={!isCollateralUpdateAllowed}
            pending={isUpdatePending}>
            {props.status === CollateralUpdateStatus.Increase ?
              t('vault.deposit_collateral') : t('vault.withdraw_collateral')}
          </InterlayDefaultContainedButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default UpdateCollateralModal;
