
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import RedeemRequestStatusUI from './RedeemRequestStatusUI';
import ReimburseStatusUI from './ReimburseStatusUI';
import IconButton from 'components/IconButton';
import PriceInfo from '../../PriceInfo';
import {
  displayBtcAmount,
  getUsdAmount,
  shortAddress
} from 'common/utils/utils';
import { RedeemRequest } from 'common/types/redeem.types';
import { StoreType } from 'common/types/util.types';
import { RedeemRequestStatus } from 'common/types/redeem.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

interface Props {
  open: boolean;
  onClose: () => void;
}

const RedeemModal = ({
  open,
  onClose
}: Props): JSX.Element => {
  const {
    address,
    prices
  } = useSelector((state: StoreType) => state.general);
  const selectedIdRequest = useSelector((state: StoreType) => state.redeem.id);
  const userRedeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];
  const request = userRedeemRequests.filter(request => request.id === selectedIdRequest)[0];
  const { t } = useTranslation();

  const renderModalStatusPanel = (request: RedeemRequest) => {
    switch (request.status) {
    case RedeemRequestStatus.Expired: {
      return (
        <ReimburseStatusUI
          request={request}
          onClose={onClose} />
      );
    }
    default: {
      return <RedeemRequestStatusUI request={request} />;
    }
    }
  };

  return (
    <Modal
      show={open}
      onHide={onClose}
      size='xl'>
      {request && (
        <>
          <h4
            className={clsx(
              'break-words',
              'font-medium',
              'text-base',
              'text-interlayTreePoppy',
              'text-center',
              'uppercase'
            )}>
            {t('issue_page.request', { id: request.id })}
          </h4>
          <IconButton
            className={clsx(
              'w-12',
              'h-12',
              'absolute',
              'top-3',
              'right-3'
            )}
            onClick={onClose}>
            <CloseIcon
              width={18}
              height={18}
              className='text-textSecondary' />
          </IconButton>
          <hr
            className={clsx(
              'border-t-2',
              'my-2',
              'border-interlayTreePoppy'
            )} />
          <Modal.Body>
            <div
              className={clsx(
                'grid',
                'grid-cols-1',
                'lg:grid-cols-2',
                'gap-10'
              )}>
              <div className='space-y-6'>
                <div className='text-center'>
                  <h4
                    className={clsx(
                      'font-medium',
                      'space-x-1'
                    )}>
                    <span className='text-5xl'>
                      {request.amountPolkaBTC}
                    </span>
                    <span
                      className={clsx(
                        'text-2xl',
                        'text-interlayRose'
                      )}>
                      InterBTC
                    </span>
                  </h4>
                  <span
                    className={clsx(
                      'text-textSecondary',
                      'block'
                    )}>
                    {`≈ $ ${getUsdAmount(request.amountPolkaBTC || '0', prices.bitcoin.usd)}`}
                  </span>
                </div>
                <div>
                  <PriceInfo
                    title={
                      <h5 className='text-textSecondary'>
                        {t('bridge_fee')}
                      </h5>
                    }
                    unitIcon={
                      <BitcoinLogoIcon
                        width={23}
                        height={23} />
                    }
                    value={displayBtcAmount(request.fee)}
                    unitName='BTC'
                    approxUSD={getUsdAmount(request.fee, prices.bitcoin.usd)} />
                  <PriceInfo
                    title={
                      <h5 className='text-textSecondary'>
                        {t('bitcoin_network_fee')}
                      </h5>
                    }
                    unitIcon={
                      <BitcoinLogoIcon
                        width={23}
                        height={23} />
                    }
                    value={displayBtcAmount(request.btcTransferFee)}
                    unitName='BTC'
                    approxUSD={getUsdAmount(request.btcTransferFee, prices.bitcoin.usd)} />
                  <hr
                    className={clsx(
                      'border-t-2',
                      'my-2.5',
                      'border-textSecondary'
                    )} />
                  <PriceInfo
                    title={
                      <h5 className='text-textSecondary'>
                        {t('you_will_receive')}
                      </h5>
                    }
                    unitIcon={
                      <BitcoinLogoIcon
                        width={23}
                        height={23} />
                    }
                    value={displayBtcAmount(request.amountBTC)}
                    unitName='BTC'
                    approxUSD={getUsdAmount(request.amountBTC, prices.bitcoin.usd)} />
                </div>
                <div className='space-y-4'>
                  <div
                    className={clsx(
                      'flex',
                      'justify-between'
                    )}>
                    <span className='text-textSecondary'>
                      {t('issue_page.destination_address')}
                    </span>
                    <span className='font-medium'>
                      {shortAddress(request.userBTCAddress || '')}
                    </span>
                  </div>
                  <div
                    className={clsx(
                      'flex',
                      'justify-between'
                    )}>
                    <span className='text-textSecondary'>
                      {t('issue_page.parachain_block')}
                    </span>
                    <span className='font-medium'>
                      {request.creation}
                    </span>
                  </div>
                  <div
                    className={clsx(
                      'flex',
                      'justify-between'
                    )}>
                    <span className='text-textSecondary'>
                      {t('issue_page.vault_dot_address')}
                    </span>
                    <span className='font-medium'>
                      {shortAddress(request.vaultDOTAddress || '')}
                    </span>
                  </div>
                </div>
              </div>
              <>{renderModalStatusPanel(request)}</>
            </div>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
};

export default RedeemModal;
