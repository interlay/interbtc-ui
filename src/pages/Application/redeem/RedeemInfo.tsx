
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle } from 'react-icons/fa';
import clsx from 'clsx';

import RedeemModal from './modal/RedeemModal';
import InterlayMalachiteOutlinedButton from 'components/buttons/InterlayMalachiteOutlinedButton';
import InterlayButton from 'components/UI/InterlayButton';
import {
  displayBtcAmount,
  getUsdAmount
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import {
  changeRedeemStepAction,
  resetRedeemWizardAction,
  changeRedeemIdAction
} from 'common/actions/redeem.actions';

const RedeemInfo = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    address,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { id } = useSelector((state: StoreType) => state.redeem);
  const requests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];
  const [modalOpen, setModalOpen] = React.useState(false);
  const request = requests.filter(request => request.id === id)[0];

  const handleClose = () => {
    dispatch(resetRedeemWizardAction());
    dispatch(changeRedeemStepAction('AMOUNT_AND_ADDRESS'));
  };

  const handleModalOpen = () => {
    dispatch(changeRedeemIdAction(request.id));
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'space-y-8'
        )}>
        {request && (
          <div className='space-y-6'>
            <div className='space-y-1'>
              <h5
                className={clsx(
                  'font-medium',
                  'text-interlayTreePoppy',
                  'flex',
                  'items-center',
                  'justify-center',
                  'space-x-1'
                )}>
                <FaExclamationCircle className='inline' />
                <span>
                  {t('redeem_page.redeem_processed')}
                </span>
              </h5>
              <h1
                className={clsx(
                  'text-3xl',
                  'font-medium',
                  'space-x-1',
                  'text-center'
                )}>
                <span>{t('redeem_page.will_receive_BTC')}</span>
                <span className='text-interlayTreePoppy'>
                  {displayBtcAmount(request.amountBTC)} BTC
                </span>
              </h1>
              <span
                className={clsx(
                  'block',
                  'text-textSecondary',
                  'text-2xl',
                  'text-center'
                )}>
                {`≈ $${getUsdAmount(request.amountPolkaBTC, prices.bitcoin.usd)}`}
              </span>
            </div>
            <div>
              <label
                htmlFor='user-btc-address'
                className='text-textSecondary'>
                {t('redeem_page.btc_destination_address')}
              </label>
              <span
                id='user-btc-address'
                // TODO: could componentize
                className={clsx(
                  'block',
                  'p-2.5',
                  'border-2',
                  'font-medium',
                  'rounded-lg',
                  'text-center'
                )}>
                {request.userBTCAddress}
              </span>
            </div>
            <div>
              <p>{t('redeem_page.we_will_inform_you_btc')}</p>
              <p className='text-textSecondary'>{t('redeem_page.typically_takes')}</p>
            </div>
          </div>
        )}
        <InterlayButton
          variant='outlined'
          color='default'
          onClick={handleModalOpen}>
          {t('redeem_page.view_progress')}
        </InterlayButton>
        <InterlayMalachiteOutlinedButton onClick={handleClose}>
          {t('close')}
        </InterlayMalachiteOutlinedButton>
      </div>
      <RedeemModal
        open={modalOpen}
        onClose={handleModalClose} />
    </>
  );
};

export default RedeemInfo;
