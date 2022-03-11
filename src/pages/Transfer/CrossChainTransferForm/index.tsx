
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import AvailableBalanceUI from 'components/AvailableBalanceUI';
import Accounts from 'components/Accounts';
import Chains, { ChainOption } from 'components/Chains';
import TokenField from 'components/TokenField';
import ErrorFallback from 'components/ErrorFallback';
import FormTitle from 'components/FormTitle';
import SubmitButton from 'components/SubmitButton';
import { COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ChainType } from 'types/chains';

const TRANSFER_AMOUNT = 'transfer-amount';

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
}

const CrossChainTransferForm = (): JSX.Element => {
  const [destination, setDestination] = React.useState<InjectedAccountWithMeta | undefined>(undefined);

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CrossChainTransferFormData>({
    mode: 'onChange'
  });

  const {
    collateralTokenTransferableBalance
  } = useSelector((state: StoreType) => state.general);

  const handleChainChange = (chainOption: ChainOption) => {
    console.log(chainOption);
  };

  const onSubmit = (data: CrossChainTransferFormData) => {
    console.log(data);
  };

  React.useEffect(() => {
    console.log(destination);
  }, [destination]);

  return (
    <form className='space-y-8'>
      <FormTitle onSubmit={handleSubmit(onSubmit)}>
        {t('transfer_page.cross_chain_transfer_form.title')}
      </FormTitle>
      <div>
        <AvailableBalanceUI
          label={t('transfer_page.cross_chain_transfer_form.balance')}
          balance={displayMonetaryAmount(collateralTokenTransferableBalance)}
          tokenSymbol={COLLATERAL_TOKEN_SYMBOL} />
        <div>
          <TokenField
            id={TRANSFER_AMOUNT}
            name={TRANSFER_AMOUNT}
            ref={register({
              required: {
                value: true,
                message: t('redeem_page.please_enter_amount')
              }
            })}
            error={!!errors[TRANSFER_AMOUNT]}
            helperText={errors[TRANSFER_AMOUNT]?.message}
            label={COLLATERAL_TOKEN_SYMBOL}
            approxUSD='≈ $ 0' />
        </div>
      </div>
      <div>
        Transferring from Kusama
      </div>
      <div>
        <Chains
          label={t('transfer_page.cross_chain_transfer_form.to_chain')}
          callbackFunction={handleChainChange}
          defaultChain={ChainType.Parachain} />
      </div>
      <div>
        <Accounts
          label={t('transfer_page.cross_chain_transfer_form.target_account')}
          callbackFunction={setDestination} />
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

