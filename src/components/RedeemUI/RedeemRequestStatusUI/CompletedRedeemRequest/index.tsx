import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, getPolkadotLink, shortAddress } from '@/common/utils/utils';
import ExternalLink from '@/components/ExternalLink';
import PrimaryColorSpan from '@/components/PrimaryColorSpan';
import Ring48, { Ring48Title, Ring48Value } from '@/components/Ring48';
import { BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import RequestWrapper from '@/pages/Bridge/RequestWrapper';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';

interface Props {
  // TODO: should type properly (`Relay`)
  redeem: any;
}

const CompletedRedeemRequest = ({ redeem }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <RequestWrapper>
      {/* TODO: could componentize */}
      <h2 className={clsx('text-3xl', 'font-medium', getColorShade('green'))}>{t('completed')}</h2>
      <p className={clsx('space-x-1', 'font-medium')}>
        <span>{t('issue_page.you_received')}</span>
        <PrimaryColorSpan>{`${displayMonetaryAmount(redeem.request.requestedAmountBacking)} BTC`}</PrimaryColorSpan>.
      </p>
      <Ring48 className={getColorShade('green', 'ring')}>
        <Ring48Title>{t('issue_page.in_parachain_block')}</Ring48Title>
        <Ring48Value className={getColorShade('green')}>{redeem.request.height.active}</Ring48Value>
      </Ring48>
      <ExternalLink className='text-sm' href={getPolkadotLink(redeem.request.height.absolute)}>
        {t('issue_page.view_parachain_block')}
      </ExternalLink>
      {/* TODO: could componentize */}
      <p className='space-x-1'>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {t('issue_page.btc_transaction')}:
        </span>
        <span className='font-medium'>{shortAddress(redeem.backingPayment.btcTxId || '')}</span>
      </p>
      <ExternalLink className='text-sm' href={`${BTC_EXPLORER_TRANSACTION_API}${redeem.backingPayment.btcTxId}`}>
        {t('issue_page.view_on_block_explorer')}
      </ExternalLink>
    </RequestWrapper>
  );
};

export default CompletedRedeemRequest;
