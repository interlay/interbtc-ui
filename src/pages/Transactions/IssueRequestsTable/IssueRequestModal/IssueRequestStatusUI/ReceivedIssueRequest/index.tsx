import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Issue } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import InterlayLink from 'components/UI/InterlayLink';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { shortAddress } from 'common/utils/utils';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';

interface Props {
  request: Issue;
}

const ReceivedIssueRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const interbtcIndex = useInterbtcIndex();

  const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = React.useState(1);
  const [stableParachainConfirmations, setStableParachainConfirmations] = React.useState(100);
  const [requestConfirmations, setRequestConfirmations] = React.useState(0);

  React.useEffect(() => {
    if (!request.creationBlock) return;

    (async () => {
      const [
        theStableBitcoinConfirmations,
        theStableParachainConfirmations,
        parachainHeight
      ] = await Promise.all([
        interbtcIndex.getBtcConfirmations(),
        window.bridge.interBtcApi.btcRelay.getStableParachainConfirmations(),
        window.bridge.interBtcApi.system.getCurrentBlockNumber()
      ]);
      setStableBitcoinConfirmations(theStableBitcoinConfirmations);
      setStableParachainConfirmations(theStableParachainConfirmations);
      setRequestConfirmations(parachainHeight - Number(request.creationBlock));
    })();
  }, [interbtcIndex, request.creationBlock]);

  return (
    <RequestWrapper id='ReceivedIssueRequest'>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium'
        )}>
        {t('received')}
      </h2>
      <div
        className={clsx(
          'w-48',
          'h-48',
          'ring-4',
          'ring-interlayConifer',
          'rounded-full',
          'inline-flex',
          'flex-col',
          'items-center',
          'justify-center'
        )}>
        <span>{t('issue_page.waiting_for')}</span>
        <span>{t('confirmations')}</span>
        <span
          className={clsx(
            'text-2xl',
            'text-interlayConifer',
            'font-medium'
          )}>
          {`${request.confirmations ?? 0}/${stableBitcoinConfirmations}`}
        </span>
        <span
          className={clsx(
            'text-2xl',
            'text-interlayConifer',
            'font-medium'
          )}>
          {`${requestConfirmations}/${stableParachainConfirmations}`}
        </span>
      </div>
      <p className='space-x-1'>
        <span
          className={clsx(
            { 'text-interlaySecondaryInLightMode':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
            { 'dark:text-kintsugiSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          {t('issue_page.btc_transaction')}:
        </span>
        <span className='font-medium'>{shortAddress(request.btcTxId || '')}</span>
      </p>
      <InterlayLink
        className={clsx(
          'text-interlayDenim',
          'space-x-1.5',
          'inline-flex',
          'items-center',
          'text-sm'
        )}
        href={`${BTC_TRANSACTION_API}${request.btcTxId}`}
        target='_blank'
        rel='noopener noreferrer'>
        <span>
          {t('issue_page.view_on_block_explorer')}
        </span>
        <FaExternalLinkAlt />
      </InterlayLink>
    </RequestWrapper>
  );
};

export default ReceivedIssueRequest;
