
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';

import Chains, { ChainOption } from 'components/Chains';
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
        <Chains callbackFunction={setFromChain} />
      </div>
      <div>
        <Chains callbackFunction={setToChain} />
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

