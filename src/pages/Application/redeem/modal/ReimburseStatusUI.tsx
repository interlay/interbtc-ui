
import * as React from 'react';
import { toast } from 'react-toastify';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';

import RequestWrapper from '../../RequestWrapper';
import InterlayButton from 'components/UI/InterlayButton';
import InterlayMalachiteOutlinedButton from 'components/buttons/InterlayMalachiteOutlinedButton';
import { getUsdAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { RedeemRequest } from 'common/types/redeem.types';
import {
  retryRedeemRequestAction,
  reimburseRedeemRequestAction
} from 'common/actions/redeem.actions';

interface Props {
  request: RedeemRequest | undefined;
  onClose: () => void;
}

const ReimburseStatusUI = ({
  request,
  onClose
}: Props): JSX.Element => {
  const {
    polkaBtcLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  // ray test touch <
  // TODO: should use enum instead of boolean for loading UX
  const [reimbursePending, setReimbursePending] = React.useState(false);
  const [retryPending, setRetryPending] = React.useState(false);
  // ray test touch >
  const [punishmentDOT, setPunishmentDOT] = React.useState(new Big(0));
  const [dotAmount, setDOTAmount] = React.useState(new Big(0));
  const dispatch = useDispatch();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!request) return;

    // ray test touch <
    // TODO: should add loading UX
    // ray test touch >
    (async () => {
      try {
        const [
          punishment,
          btcDotRate
        ] = await Promise.all([
          window.polkaBTC.vaults.getPunishmentFee(),
          window.polkaBTC.oracle.getExchangeRate()
        ]);
        const amountPolkaBTC = request ? new Big(request.amountPolkaBTC) : new Big(0);
        setDOTAmount(amountPolkaBTC.mul(btcDotRate));
        setPunishmentDOT(amountPolkaBTC.mul(btcDotRate).mul(new Big(punishment)));
      } catch (error) {
        // ray test touch <
        // TODO: should add error handling UX
        // ray test touch >
        console.log('[ReimburseStatusUI useEffect] error.message => ', error.message);
      }
    })();
  }, [
    request,
    polkaBtcLoaded
  ]);

  const handleRetry = async () => {
    if (!polkaBtcLoaded) {
      throw new Error('PolkaBTC is not loaded!');
    }
    if (!request) {
      throw new Error('Invalid request!');
    }

    setRetryPending(true);
    try {
      const redeemId = window.polkaBTC.api.createType('H256', '0x' + request.id);
      await window.polkaBTC.redeem.cancel(redeemId, false);
      dispatch(retryRedeemRequestAction(request.id));
      onClose();
      toast.success(t('redeem_page.successfully_cancelled_redeem'));
    } catch (error) {
      // ray test touch <
      // TODO: should add error handling UX
      // ray test touch >
      console.log('[handleRetry] error => ', error);
    }
    setRetryPending(false);
  };

  const handleBurn = async () => {
    if (!polkaBtcLoaded) {
      throw new Error('PolkaBTC is not loaded!');
    }
    if (!request) {
      throw new Error('Invalid request!');
    }

    try {
      setReimbursePending(true);
      const redeemId = window.polkaBTC.api.createType('H256', '0x' + request.id);
      await window.polkaBTC.redeem.cancel(redeemId, true);
      dispatch(reimburseRedeemRequestAction(request.id));
      onClose();
      toast.success(t('redeem_page.successfully_cancelled_redeem'));
    } catch (error) {
      // ray test touch <
      // TODO: should add error handling UX
      // ray test touch >
      console.log('[handleBurn] error => ', error);
    }
    setReimbursePending(false);
  };

  return (
    <RequestWrapper
      id='ReimburseStatusUI'
      className='lg:px-12'>
      <div className='space-y-1'>
        <h2
          className={clsx(
            'text-lg',
            'font-medium',
            'text-interlayTreePoppy',
            'flex',
            'justify-center',
            'items-center',
            'space-x-1'
          )}>
          <FaExclamationCircle />
          <span>
            {t('redeem_page.sorry_redeem_failed')}
          </span>
        </h2>
        <p
          className={clsx(
            'text-textSecondary',
            'text-justify'
          )}>
          <span>{t('redeem_page.vault_did_not_send')}</span>
          <span className='text-interlayRose'>
            &nbsp;{punishmentDOT.toFixed(2).toString()} DOT
          </span>
          <span>&nbsp;{`(≈ $ ${getUsdAmount(punishmentDOT.toString(), prices.polkadot.usd)})`}</span>
          <span>&nbsp;{t('redeem_page.compensation')}</span>
          .
        </p>
      </div>
      <div className='space-y-2'>
        <h5 className='font-medium'>
          {t('redeem_page.to_redeem_interbtc')}
        </h5>
        <ul
          className={clsx(
            'space-y-3',
            'ml-6',
            'text-textSecondary'
          )}>
          <li className='list-decimal'>
            <p className='text-justify'>
              <span>{t('redeem_page.receive_compensation')}</span>
              <span className='text-interlayRose'>&nbsp;{punishmentDOT.toFixed(2)} DOT</span>
              <span>
                &nbsp;
                {t('redeem_page.retry_with_another', {
                  compensationPrice: getUsdAmount(punishmentDOT.toString(), prices.polkadot.usd)
                })}
              </span>
              .
            </p>
            <InterlayMalachiteOutlinedButton
              className='w-full'
              disabled={retryPending || reimbursePending}
              pending={retryPending}
              onClick={handleRetry}>
              {t('retry')}
            </InterlayMalachiteOutlinedButton>
          </li>
          <li className='list-decimal'>
            <p className='text-justify'>
              <span>{t('redeem_page.burn_interbtc')}</span>
              <span className='text-interlayRose'>&nbsp;{dotAmount.toFixed(5).toString()} DOT</span>
              <span>
                &nbsp;
                {t('redeem_page.with_added', {
                  amountPrice: getUsdAmount(dotAmount.toString(), prices.polkadot.usd)
                })}
              </span>
              <span className='text-interlayRose'>&nbsp;{punishmentDOT.toFixed(5).toString()} DOT</span>
              <span>
                &nbsp;
                {t('redeem_page.as_compensation_instead', {
                  compensationPrice: getUsdAmount(punishmentDOT.toString(), prices.polkadot.usd)
                })}
              </span>
            </p>
            <InterlayButton
              className='w-full'
              variant='outlined'
              color='primary'
              disabled={retryPending || reimbursePending}
              pending={reimbursePending}
              onClick={handleBurn}>
              {t('redeem_page.burn')}
            </InterlayButton>
          </li>
        </ul>
      </div>
    </RequestWrapper>
  );
};

export default ReimburseStatusUI;
