
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
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

const CrossChainTransferForm = (): JSX.Element => {
  const [destination, setDestination] = React.useState<InjectedAccountWithMeta | undefined>(undefined);

  const { t } = useTranslation();

  const {
    collateralTokenTransferableBalance
  } = useSelector((state: StoreType) => state.general);

  const handleChainChange = (chainOption: ChainOption) => {
    console.log(chainOption);
  };

  React.useEffect(() => {
    console.log(destination);
  }, [destination]);

  return (
    <form className='space-y-8'>
      <FormTitle>
        {t('transfer_page.cross_chain_transfer_form.title')}
      </FormTitle>
      <div>
        <AvailableBalanceUI
          label={t('transfer_page.cross_chain_transfer_form.balance')}
          balance={displayMonetaryAmount(collateralTokenTransferableBalance)}
          tokenSymbol={COLLATERAL_TOKEN_SYMBOL} />
        <div>
          <TokenField
            label={COLLATERAL_TOKEN_SYMBOL}
            approxUSD='≈ $ 0' />
        </div>
      </div>
      <div>
        <Chains
          label={t('transfer_page.cross_chain_transfer_form.from_chain')}
          callbackFunction={handleChainChange}
          defaultChain={ChainType.Relaychain} />
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

