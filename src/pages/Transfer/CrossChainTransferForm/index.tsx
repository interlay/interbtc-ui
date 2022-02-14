
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from 'components/ErrorFallback';
import FormTitle from 'components/FormTitle';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';

const CrossChainTransferForm = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <form
        className='space-y-8'
        onSubmit={() => {
          return;
        }}>
        <FormTitle>
          {t('transfer_page.transfer_currency')}
        </FormTitle>
        <div>
          <p
            className={clsx(
              'mb-2',
              'text-right',
              { 'text-interlayDenim':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiOchre':
        process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>Transferable balance:
          </p>
        </div>
      </form>
      {}
    </>
  );
};

export default withErrorBoundary(CrossChainTransferForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});

