import { Redeem } from '@interlay/interbtc-api';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle } from 'react-icons/fa';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Modal, ModalBody } from '@/component-library';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import InterlayDefaultContainedButton from '@/legacy-components/buttons/InterlayDefaultContainedButton';
import { Props as ModalProps } from '@/legacy-components/UI/InterlayModal';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const USER_BTC_ADDRESS = 'user-btc-address';

interface CustomProps {
  request: Redeem;
}

const LegacyRedeemModal = ({ open, onClose, request }: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  return (
    <Modal align='top' isOpen={open} onClose={onClose}>
      <ModalBody>
        <div className={clsx('flex', 'flex-col', 'space-y-8')}>
          <h4 className={clsx('text-2xl', getColorShade('yellow'), 'font-medium', 'text-center')}>
            {t('redeem_page.redeem')}
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
                <span className={getColorShade('yellow')}>{request.amountBTC.toHuman(8)} BTC</span>
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
            <div className={clsx('flex', 'items-center', 'justify-center', 'space-x-2')}>
              <label
                htmlFor={USER_BTC_ADDRESS}
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('redeem_page.btc_destination_address')}:
              </label>
              <AddressWithCopyUI id={USER_BTC_ADDRESS} address={request.userBTCAddress} />
            </div>
            <div>
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
          <InterlayDefaultContainedButton onClick={onClose} className='w-full'>
            {t('redeem_page.close')}
          </InterlayDefaultContainedButton>
        </div>
      </ModalBody>
    </Modal>
  );
};

export { LegacyRedeemModal };
