import { useQuery } from 'react-query';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import Ring48, { Ring48Title, Ring48Value } from 'components/Ring48';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { getColorShade } from 'utils/helpers/colors';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import useCurrentActiveBlockNumber from 'services/hooks/use-current-active-block-number';

interface Props {
  // TODO: should type properly (`Relay`)
  redeem: any;
}

const DefaultRedeemRequest = ({ redeem }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: stableBitcoinConfirmationsIdle,
    isLoading: stableBitcoinConfirmationsLoading,
    data: stableBitcoinConfirmations = 1, // TODO: double-check
    error: stableBitcoinConfirmationsError
  } = useQuery<number, Error>(
    [GENERIC_FETCHER, 'btcRelay', 'getStableBitcoinConfirmations'],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(stableBitcoinConfirmationsError);

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations = 100, // TODO: double-check
    error: stableParachainConfirmationsError
  } = useQuery<number, Error>(
    [GENERIC_FETCHER, 'btcRelay', 'getStableParachainConfirmations'],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(stableParachainConfirmationsError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber = 0, // TODO: double-check
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  // TODO: should use skeleton loaders
  if (
    stableBitcoinConfirmationsIdle ||
    stableBitcoinConfirmationsLoading ||
    stableParachainConfirmationsIdle ||
    stableParachainConfirmationsLoading ||
    currentActiveBlockNumberIdle ||
    currentActiveBlockNumberLoading
  ) {
    return <>Loading...</>;
  }

  const requestConfirmations = redeem.backingPayment.includedAtParachainActiveBlock
    ? currentActiveBlockNumber - redeem.backingPayment.includedAtParachainActiveBlock
    : 0;

  return (
    <RequestWrapper>
      <h2 className={clsx('text-3xl', 'font-medium')}>{t('received')}</h2>
      <Ring48 className={getColorShade('yellow', 'ring')}>
        <Ring48Title>{t('redeem_page.waiting_for')}</Ring48Title>
        <Ring48Title>{t('confirmations')}</Ring48Title>
        <Ring48Value className={getColorShade('green')}>
          {`${redeem.backingPayment.confirmations || 0}/${stableBitcoinConfirmations}`}
        </Ring48Value>
        <Ring48Value className={getColorShade('green')}>
          {`${requestConfirmations}/${stableParachainConfirmations}`}
        </Ring48Value>
      </Ring48>
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
    </RequestWrapper>
  );
};

export default DefaultRedeemRequest;
