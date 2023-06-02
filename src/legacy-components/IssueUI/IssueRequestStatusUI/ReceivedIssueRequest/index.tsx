import clsx from 'clsx';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '@/common/utils/utils';
import { BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import ExternalLink from '@/legacy-components/ExternalLink';
import Ring48, { Ring48Title, Ring48Value } from '@/legacy-components/Ring48';
import RequestWrapper from '@/pages/Bridge copy/RequestWrapper';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const ReceivedIssueRequest = ({ request }: Props): JSX.Element => {
  const { t } = useTranslation();

  const {
    isIdle: stableBitcoinConfirmationsIdle,
    isLoading: stableBitcoinConfirmationsLoading,
    data: stableBitcoinConfirmations = 1, // TODO: double-check
    error: stableBitcoinConfirmationsError
  } = useStableBitcoinConfirmations();
  useErrorHandler(stableBitcoinConfirmationsError);

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations = 100, // TODO: double-check
    error: stableParachainConfirmationsError
  } = useStableParachainConfirmations();
  useErrorHandler(stableParachainConfirmationsError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber = 0, // TODO: double-check
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  // TODO: should use skeleton loaders
  if (stableBitcoinConfirmationsIdle || stableBitcoinConfirmationsLoading) {
    return <>Loading...</>;
  }
  if (stableParachainConfirmationsIdle || stableParachainConfirmationsLoading) {
    return <>Loading...</>;
  }
  if (currentActiveBlockNumberIdle || currentActiveBlockNumberLoading) {
    return <>Loading...</>;
  }

  const requestConfirmations = request.backingPayment.includedAtParachainActiveBlock
    ? currentActiveBlockNumber - request.backingPayment.includedAtParachainActiveBlock
    : 0;

  return (
    <RequestWrapper>
      <h2 className={clsx('text-3xl', 'font-medium')}>{t('received')}</h2>
      <Ring48 className={getColorShade('green')}>
        <Ring48Title>{t('issue_page.waiting_for')}</Ring48Title>
        <Ring48Title>{t('confirmations')}</Ring48Title>
        <Ring48Value className={getColorShade('green')}>
          {`${formatNumber(request.backingPayment.confirmations ?? 0)}/${formatNumber(stableBitcoinConfirmations)}`}
        </Ring48Value>
        <Ring48Value className={getColorShade('green')}>
          {`${formatNumber(requestConfirmations)}/${formatNumber(stableParachainConfirmations)}`}
        </Ring48Value>
      </Ring48>
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

export default withErrorBoundary(ReceivedIssueRequest, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
