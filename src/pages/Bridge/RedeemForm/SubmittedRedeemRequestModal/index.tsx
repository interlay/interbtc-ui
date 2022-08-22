import { Redeem } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle } from 'react-icons/fa';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import CloseIconButton from '@/components/buttons/CloseIconButton';
import InterlayDefaultContainedButton from '@/components/buttons/InterlayDefaultContainedButton';
import InterlayModal, { InterlayModalInnerWrapper, Props as ModalProps } from '@/components/UI/InterlayModal';
import InterlayRouterLink from '@/components/UI/InterlayRouterLink';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const queryString = require('query-string');

const USER_BTC_ADDRESS = 'user-btc-address';

interface CustomProps {
  request: Redeem;
}

const SubmittedRedeemRequestModal = ({
  open,
  onClose,
  request
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const focusRef = React.useRef(null);

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-8', 'max-w-lg')}>
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <div className={clsx('flex', 'flex-col', 'space-y-8')}>
          <h4 className={clsx('text-2xl', getColorShade('yellow'), 'font-medium', 'text-center')}>
            {t('redeem_page.withdraw')}
          </h4>
          <div className='space-y-6'>
            <div className='space-y-1'>
              <h5
                className={clsx(
                  'font-medium',
                  getColorShade('yellow'),
                  'flex',
                  'items-center',
                  'justify-center',
                  'space-x-1'
                )}
              >
                <FaExclamationCircle className='inline' />
                <span>{t('redeem_page.redeem_processed')}</span>
              </h5>
              <h1 className={clsx('text-3xl', 'font-medium', 'space-x-1', 'text-center')}>
                <span>{t('redeem_page.will_receive_BTC')}</span>
                <span className={getColorShade('yellow')}>{displayMonetaryAmount(request.amountBTC)} BTC</span>
              </h1>
              <span
                className={clsx(
                  'block',
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  'text-2xl',
                  'text-center'
                )}
              >
                {`≈ ${displayMonetaryAmountInUSDFormat(
                  request.amountBTC,
                  getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
                )}`}
              </span>
            </div>
            <div>
              <label
                htmlFor={USER_BTC_ADDRESS}
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('redeem_page.btc_destination_address')}
              </label>
              <span
                id={USER_BTC_ADDRESS}
                // TODO: could componentize
                className={clsx('block', 'p-2.5', 'border-2', 'font-medium', 'rounded-lg', 'text-center')}
              >
                {request.userBTCAddress}
              </span>
            </div>
            <div>
              <p>{t('redeem_page.we_will_inform_you_btc')}</p>
              <p
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('redeem_page.typically_takes')}
              </p>
            </div>
          </div>
          <InterlayRouterLink
            to={{
              pathname: PAGES.TRANSACTIONS,
              search: queryString.stringify({
                [QUERY_PARAMETERS.REDEEM_REQUEST_ID]: request.id
              })
            }}
          >
            <InterlayDefaultContainedButton onClick={onClose} className='w-full'>
              {t('redeem_page.view_progress')}
            </InterlayDefaultContainedButton>
          </InterlayRouterLink>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default SubmittedRedeemRequestModal;
