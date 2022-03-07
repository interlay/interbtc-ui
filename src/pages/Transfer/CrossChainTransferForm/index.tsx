
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { StoreType } from 'common/types/util.types';
import { displayMonetaryAmount } from 'common/utils/utils';
import Accounts from 'components/Accounts';
import Chains, { ChainOption } from 'components/Chains';
import TokenField from 'components/TokenField';
import ErrorFallback from 'components/ErrorFallback';
import FormTitle from 'components/FormTitle';
import SubmitButton from 'components/SubmitButton';

const TRANSFER_AMOUNT = 'transfer-amount';

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
}

const CrossChainTransferForm = (): JSX.Element => {
  const [fromChain, setFromChain] = React.useState<ChainOption | undefined>(undefined);
  const [toChain, setToChain] = React.useState<ChainOption | undefined>(undefined);
  const { t } = useTranslation();

  const {
    collateralTokenTransferableBalance
  } = useSelector((state: StoreType) => state.general);

  const onSubmit = (data: CrossChainTransferFormData) => {
    console.log('form submitted', data, fromChain, toChain);
  };

  const { handleSubmit } = useForm<CrossChainTransferFormData>({
    mode: 'onChange'
  });

  return (
    <form
      className='space-y-8'
      onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>
        {t('transfer_page.cross_chain_transfer')}
      </FormTitle>
      <div>
        <div>
          <p
            className={clsx(
              'mb-2',
              'text-right',
              { 'text-interlayDenim':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiOchre':
        process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>Transferable balance: {displayMonetaryAmount(collateralTokenTransferableBalance)}
          </p>
        </div>
        <div>
          <TokenField label={COLLATERAL_TOKEN_SYMBOL} />
        </div>
        <Chains callbackFunction={setFromChain} />
      </div>
      <div>
        <Chains callbackFunction={setToChain} />
      </div>
      <div>
        <Accounts />
      </div>
      <SubmitButton>
          Submit
      </SubmitButton>
    </form>
  );
};

export default withErrorBoundary(CrossChainTransferForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});

