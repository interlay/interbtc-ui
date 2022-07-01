import { useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import Ring48, { Ring48Title, Ring48Value } from 'components/Ring48';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { shortAddress } from 'common/utils/utils';
import { getColorShade } from 'utils/helpers/colors';
import useCurrentActiveBlockNumber from 'services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from 'services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from 'services/hooks/use-stable-parachain-confirmations';

interface Props {
  // TODO: should type properly (`Relay`)
  redeem: any;
}

const DefaultRedeemRequest = ({ redeem }: Props): JSX.Element => {
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
