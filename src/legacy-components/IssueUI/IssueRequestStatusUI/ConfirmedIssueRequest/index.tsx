import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';

import { BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import ExternalLink from '@/legacy-components/ExternalLink';
import RequestWrapper from '@/pages/Bridge copy/RequestWrapper';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';

import ManualIssueExecutionUI from '../ManualIssueExecutionUI';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const ConfirmedIssueRequest = ({ request }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <RequestWrapper className='px-12'>
        <h2 className={clsx('text-3xl', 'font-medium', getColorShade('green'))}>{t('confirmed')}</h2>
        <FaCheckCircle className={clsx('w-40', 'h-40', getColorShade('green'))} />
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
        <p
          className={clsx(
            'text-justify',
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {t('issue_page.receive_interbtc_tokens', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </p>
        <ManualIssueExecutionUI request={request} />
      </RequestWrapper>
    </>
  );
};

export default ConfirmedIssueRequest;
