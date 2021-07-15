import { SyntheticEvent, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateCollateralAction, updateCollateralizationAction } from '../../../common/actions/vault.actions';
import { roundTwoDecimals } from '@interlay/interbtc';
import { StoreType } from '../../../common/types/util.types';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import { Polkadot, PolkadotAmount } from '@interlay/monetary-js';

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

type UpdateCollateralProps = {
  onClose: () => void;
  status: CollateralUpdateStatus;
};

export default function UpdateCollateralModal(props: UpdateCollateralProps): JSX.Element {
  const { polkaBtcLoaded, vaultClientLoaded, address } = useSelector((state: StoreType) => state.general);
  const { register, handleSubmit, errors } = useForm<UpdateCollateralForm>();
  // denoted in DOT
  const currentCollateral = useSelector((state: StoreType) => state.vault.collateral);
  // denoted in DOT
  const [newCollateral, setNewCollateral] = useState(currentCollateral);
  // denoted in DOT
  const [newCollateralization, setNewCollateralization] = useState('∞');

  const [currentButtonText, setCurrentButtonText] = useState('');

  const [isUpdatePending, setUpdatePending] = useState(false);
  const [isCollateralUpdateAllowed, setCollateralUpdateAllowed] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onSubmit = handleSubmit(async () => {
    if (!polkaBtcLoaded) return;
    if (!vaultClientLoaded) return;

    setUpdatePending(true);
    try {
      const parsedNewCollateral = PolkadotAmount.from.DOT(newCollateral);
      const parsedCurrentCollateral = PolkadotAmount.from.DOT(currentCollateral);

      if (parsedCurrentCollateral.gt(parsedNewCollateral)) {
        const withdrawAmount = parsedCurrentCollateral.sub(parsedNewCollateral);
        await window.polkaBTC.vaults.withdrawCollateral(withdrawAmount);
      } else if (parsedCurrentCollateral.lt(parsedNewCollateral)) {
        const depositAmount = parsedNewCollateral.sub(parsedCurrentCollateral);
        await window.polkaBTC.vaults.depositCollateral(depositAmount);
      } else {
        closeModal();
        return;
      }

      const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      const balanceLockedDOT = await window.polkaBTC.tokens.balanceLocked(Polkadot, vaultId);
      dispatch(updateCollateralAction(balanceLockedDOT.toHuman()));
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

  const onChange = async (obj: SyntheticEvent) => {
    try {
      const value = (obj.target as HTMLInputElement).value;
      if (value === '' || !polkaBtcLoaded || Number(value) <= 0 || isNaN(Number(value))) {
        setCollateralUpdateAllowed(false);
        return;
      }
      const parsedValue = PolkadotAmount.from.DOT(value);
      if (parsedValue.toBig(parsedValue.currency.rawBase).lte(1)) {
        throw new Error('Please enter an amount greater than 1 Planck');
      }

      // decide if we withdraw or add collateral
      if (!currentCollateral) {
        throw new Error('Couldn\'t fetch current vault collateral');
      }

      let parsedNewCollateral = PolkadotAmount.from.DOT(currentCollateral);
      if (props.status === CollateralUpdateStatus.Increase) {
        parsedNewCollateral = parsedNewCollateral.add(parsedValue);
      } else if (props.status === CollateralUpdateStatus.Decrease) {
        parsedNewCollateral = parsedNewCollateral.sub(parsedValue);
      }
      setNewCollateral(newCollateral);

      const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      const requiredCollateral = await window.polkaBTC.vaults.getRequiredCollateralForVault(vaultId, Polkadot);

      // collateral update only allowed if above required collateral
      const allowed = parsedNewCollateral.gte(requiredCollateral);
      setCollateralUpdateAllowed(allowed);

      // get the updated collateralization
      const newCollateralization = await window.polkaBTC.vaults.getVaultCollateralization(vaultId, parsedNewCollateral);
      if (newCollateralization === undefined) {
        setNewCollateralization('∞');
      } else {
        // The vault API returns collateralization as a regular number rather than a percentage
        setNewCollateralization(newCollateralization.mul(100).toString());
      }
    } catch (err) {
      console.log(err);
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

  function getStatusText(status: CollateralUpdateStatus): string {
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
  }

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
            <div className='col-12 current-collateral'>
              {t('vault.current_total_collateral', { currentCollateral })}
            </div>
            <div className='col-12 current-collateral'>
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
                <div className='input-error text-interlayConifer'>
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
}
