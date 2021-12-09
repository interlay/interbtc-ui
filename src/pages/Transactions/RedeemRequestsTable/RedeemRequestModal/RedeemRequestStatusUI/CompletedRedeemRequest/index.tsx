
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Redeem } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import ExternalLink from 'components/ExternalLink';
import PrimaryColorSpan from 'components/PrimaryColorSpan';
import Ring48, {
  Ring48Title,
  Ring48Value
} from 'components/Ring48';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  shortAddress,
  displayMonetaryAmount,
  getPolkadotLink
} from 'common/utils/utils';

interface Props {
  request: Redeem;
}

const CompletedRedeemRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <RequestWrapper>
      {/* TODO: could componentize */}
      <h2
        className={clsx(
          'text-3xl',
          'font-medium',
          'text-interlayConifer'
        )}>
        {t('completed')}
      </h2>
      <p
        className={clsx(
          'space-x-1',
          'font-medium'
        )}>
        <span>{t('issue_page.you_received')}</span>
        <PrimaryColorSpan>
          {`${displayMonetaryAmount(request.amountBTC)} BTC`}
        </PrimaryColorSpan>
        .
      </p>
      <Ring48 className='ring-interlayConifer'>
        <Ring48Title>
          {t('issue_page.in_parachain_block')}
        </Ring48Title>
        <Ring48Value className='text-interlayConifer'>
          {request.creationBlock}
        </Ring48Value>
      </Ring48>
      <ExternalLink
        className='text-sm'
        href={getPolkadotLink(request.creationBlock)}>
        {t('issue_page.view_parachain_block')}
      </ExternalLink>
      {/* TODO: could componentize */}
      <p className='space-x-1'>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          {t('issue_page.btc_transaction')}:
        </span>
        <span className='font-medium'>{shortAddress(request.btcTxId || '')}</span>
      </p>
      <ExternalLink
        className='text-sm'
        href={`${BTC_TRANSACTION_API}${request.btcTxId}`}>
        {t('issue_page.view_on_block_explorer')}
      </ExternalLink>
    </RequestWrapper>
  );
};

export default CompletedRedeemRequest;
