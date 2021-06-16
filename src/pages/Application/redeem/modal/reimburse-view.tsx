import React, { useState, ReactElement, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { StoreType } from '../../../../common/types/util.types';
import ButtonMaybePending from '../../../../common/components/pending-button';
import { useTranslation } from 'react-i18next';
import { RedeemRequest } from '../../../../common/types/redeem.types';
import { retryRedeemRequestAction, reimburseRedeemRequestAction } from '../../../../common/actions/redeem.actions';
import Big from 'big.js';
import fetchBalances from '../../../../common/live-data/balances-watcher';
import { getUsdAmount } from '../../../../common/utils/utils';

type ReimburseViewProps = {
  onClose: () => void;
  request: RedeemRequest | undefined;
};

export default function ReimburseView(props: ReimburseViewProps): ReactElement {
  const [isReimbursePending, setReimbursePending] = useState(false);
  const [isRetryPending, setRetryPending] = useState(false);
  const { polkaBtcLoaded, prices } = useSelector((state: StoreType) => state.general);
  const [punishmentDOT, setPunishmentDOT] = useState(new Big(0));
  const [amountDOT, setAmountDOT] = useState(new Big(0));
  const dispatch = useDispatch();
  const store = useStore();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const [punishment, btcDotRate] = await Promise.all([
          window.polkaBTC.vaults.getPunishmentFee(),
          window.polkaBTC.oracle.getExchangeRate()
        ]);
        const amountPolkaBTC = props.request ? new Big(props.request.amountPolkaBTC) : new Big(0);
        setAmountDOT(amountPolkaBTC.mul(btcDotRate));
        setPunishmentDOT(amountPolkaBTC.mul(btcDotRate).mul(new Big(punishment)));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [props.request, polkaBtcLoaded]);

  const onRetry = async () => {
    if (!polkaBtcLoaded) return;
    setRetryPending(true);
    try {
      if (!props.request) return;
      const redeemId = window.polkaBTC.api.createType('H256', '0x' + props.request.id);
      await window.polkaBTC.redeem.cancel(redeemId, false);
      dispatch(retryRedeemRequestAction(props.request.id));
      // ray test touch <
      // TODO: should drop after testing
      await fetchBalances(dispatch, store);
      // ray test touch >
      props.onClose();
      toast.success(t('redeem_page.successfully_cancelled_redeem'));
    } catch (error) {
      console.log(error);
    }
    setRetryPending(false);
  };

  const onBurn = async () => {
    if (!polkaBtcLoaded) return;
    setReimbursePending(true);
    try {
      if (!props.request) return;
      const redeemId = window.polkaBTC.api.createType('H256', '0x' + props.request.id);
      await window.polkaBTC.redeem.cancel(redeemId, true);
      dispatch(reimburseRedeemRequestAction(props.request.id));
      // ray test touch <
      // TODO: should drop after testing
      await fetchBalances(dispatch, store);
      // ray test touch >
      props.onClose();
    } catch (error) {
      console.log(error);
    }
    setReimbursePending(false);
  };

  return (
    <React.Fragment>
      <div className='row mt-3'>
        <div className='col reimburse-title'>
          <p className='mb-4'>
            <i className='fas fa-exclamation-circle'></i> &nbsp;
            {t('redeem_page.sorry_redeem_failed')}
          </p>
        </div>
      </div>
      <div className='row justify-center mt-4'>
        <div className='col-9 reimburse-send'>
          {t('redeem_page.vault_did_not_send')}
          <span>{punishmentDOT.toFixed(2).toString()} DOT </span>&nbsp; (~${' '}
          {getUsdAmount(punishmentDOT.toString(), prices.polkadot.usd)})&nbsp;
          {t('redeem_page.compensation')}
        </div>
      </div>
      <div className='row justify-center'>
        <div className='col-9 to-redeem'>
          <p className='mb-4'>{t('redeem_page.to_redeem_polkabtc')}</p>
        </div>
      </div>
      <div className='row justify-center'>
        <div className='col-9 receive-compensation'>
          {t('redeem_page.receive_compensation')}
          <span>{punishmentDOT.toFixed(2)} DOT</span> &nbsp;
          {t('redeem_page.retry_with_another', {
            compensationPrice: getUsdAmount(punishmentDOT.toString(), prices.polkadot.usd)
          })}
        </div>
      </div>
      <div className='row justify-center'>
        <div className='col-6 retry'>
          <ButtonMaybePending
            className='btn green-button app-btn'
            disabled={isRetryPending || isReimbursePending}
            isPending={isRetryPending}
            onClick={onRetry}>
            {t('retry')}
          </ButtonMaybePending>
        </div>
      </div>

      <div className='row justify-center mt-4'>
        <div className='col-10 burn-desc'>
          {t('redeem_page.burn_polkabtc')}
          <span>{amountDOT.toFixed(5).toString()} DOT</span> &nbsp;
          {t('redeem_page.with_added', {
            amountPrice: getUsdAmount(amountDOT.toString(), prices.polkadot.usd)
          })}
          <span>{punishmentDOT.toFixed(5).toString()} DOT</span> &nbsp;
          {t('redeem_page.as_compensation_instead', {
            compensationPrice: getUsdAmount(punishmentDOT.toString(), prices.polkadot.usd)
          })}
        </div>
      </div>

      <div className='row justify-center'>
        <div className='col-6 burn'>
          <Button
            variant='btn red-button app-btn'
            onClick={onBurn}>
            {t('redeem_page.burn')}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
