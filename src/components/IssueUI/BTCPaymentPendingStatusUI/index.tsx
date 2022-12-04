import clsx from 'clsx';
import QRCode from 'qrcode.react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmountInUSDFormat, shortAddress } from '@/common/utils/utils';
import CopyToClipboardButton from '@/components/CopyToClipboardButton';
import Timer from '@/components/Timer';
import { BLOCK_TIME } from '@/config/parachain';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

// TODO: when sorting out GraphQL typing, take into account that this component also displays a request from the lib
const BTCPaymentPendingStatusUI = ({ request }: Props): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const amountBTCToSend = (request.wrappedAmount || request.request.amountWrapped).add(
    request.bridgeFee || request.request.bridgeFeeWrapped
  );

  const [initialLeftSeconds, setInitialLeftSeconds] = React.useState<number>();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!request) return;

    (async () => {
      try {
        const [issuePeriodInBlocks, requestById] = await Promise.all([
          window.bridge.issue.getIssuePeriod(),
          window.bridge.issue.getRequestById(request.id)
        ]);

        const maxIssuePeriodInBlocks = Math.max(issuePeriodInBlocks, requestById.period);

        // TODO: double-check `request.request?.timestamp`
        // Date.now() is an approximation, used with the parachain response until we can get the block timestamp later
        const requestCreationTimestamp = request.request?.timestamp ?? Date.now();

        const requestTimestamp = Math.floor(new Date(requestCreationTimestamp).getTime() / 1000);
        const theInitialLeftSeconds =
          requestTimestamp + maxIssuePeriodInBlocks * BLOCK_TIME - Math.floor(Date.now() / 1000);
        setInitialLeftSeconds(theInitialLeftSeconds);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[BTCPaymentPendingStatusUI useEffect] error.message => ', error.message);
      }
    })();
  }, [request, bridgeLoaded]);

  const bitcoinRecipientAddress = request.vaultWrappedAddress || request.vaultBackingAddress;

  return (
    <div className='space-y-8'>
      <div className={clsx('flex', 'flex-col', 'justify-center', 'items-center')}>
        <div className='text-xl'>
          {t('send')}
          <span className={getColorShade('yellow')}>&nbsp;{amountBTCToSend.toHuman(8)}&nbsp;</span>
          BTC
        </div>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'block'
          )}
        >
          {`≈ ${displayMonetaryAmountInUSDFormat(
            amountBTCToSend,
            getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
          )}`}
        </span>
      </div>
      <div>
        <p
          className={clsx(
            'text-center',
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {t('issue_page.single_transaction')}
        </p>
        {/* ray test touch < */}
        <div className={clsx('flex', 'items-center', 'justify-center', 'space-x-1', 'p-2.5', 'font-medium')}>
          <span>{shortAddress(bitcoinRecipientAddress)}</span>
          <CopyToClipboardButton text={bitcoinRecipientAddress} />
        </div>
        {/* ray test touch > */}
        {initialLeftSeconds && (
          <p className={clsx('flex', 'justify-center', 'items-center', 'space-x-1')}>
            <span
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                'capitalize'
              )}
            >
              {t('issue_page.within')}
            </span>
            <Timer initialLeftSeconds={initialLeftSeconds} />
          </p>
        )}
      </div>
      <p className='space-x-1'>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'break-all'
          )}
        >
          {t('issue_page.warning_mbtc_wallets')}
        </span>
        <span className={getColorShade('yellow')}>{amountBTCToSend.mul(1000).toHuman(8)}&nbsp;mBTC</span>
      </p>
      <QRCode
        includeMargin
        className='mx-auto'
        value={`bitcoin:${bitcoinRecipientAddress}?amount=${amountBTCToSend.toHuman(8)}`}
      />
      <div
        className={clsx(
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}
      >
        <div className={clsx('inline-flex', 'items-center', 'space-x-0.5', 'mr-1')}>
          <span>{t('note')}</span>
          <FaExclamationCircle />
          <span>:</span>
        </div>
        <span>{t('issue_page.waiting_deposit')}</span>
      </div>
    </div>
  );
};

export default BTCPaymentPendingStatusUI;
