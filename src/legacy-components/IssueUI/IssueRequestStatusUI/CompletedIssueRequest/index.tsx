import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { formatNumber, getPolkadotLink } from '@/common/utils/utils';
import { BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import ExternalLink from '@/legacy-components/ExternalLink';
import PrimaryColorSpan from '@/legacy-components/PrimaryColorSpan';
import RequestWrapper from '@/legacy-components/RequestWrapper';
import Ring48, { Ring48Title, Ring48Value } from '@/legacy-components/Ring48';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const CompletedIssueRequest = ({ request }: Props): JSX.Element => {
  const { t } = useTranslation();

  const receivedWrappedTokenAmount = request.execution.amountWrapped;

  return (
    <RequestWrapper>
      <h2 className={clsx('text-3xl', 'font-medium', getColorShade('green'))}>{t('completed')}</h2>
      <p className={clsx('space-x-1', 'font-medium')}>
        <span>{t('issue_page.you_received')}</span>
        <PrimaryColorSpan>
          {receivedWrappedTokenAmount.toHuman(8)} {WRAPPED_TOKEN_SYMBOL}
        </PrimaryColorSpan>
      </p>
      <Ring48 className={getColorShade('green', 'ring')}>
        <Ring48Title>{t('issue_page.in_parachain_block')}</Ring48Title>
        <Ring48Value className={getColorShade('green')}>{formatNumber(request.execution.height.absolute)}</Ring48Value>
      </Ring48>
      <ExternalLink className='text-sm' href={getPolkadotLink(request.execution.height.absolute)}>
        {t('issue_page.view_parachain_block')}
      </ExternalLink>
      <div className={clsx('space-x-1', 'flex', 'items-center')}>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {t('issue_page.btc_transaction')}:
        </span>
        <AddressWithCopyUI address={request.backingPayment.btcTxId || ''} />
      </div>
      <ExternalLink className='text-sm' href={`${BTC_EXPLORER_TRANSACTION_API}${request.backingPayment.btcTxId}`}>
        {t('issue_page.view_on_block_explorer')}
      </ExternalLink>
    </RequestWrapper>
  );
};

export default CompletedIssueRequest;
