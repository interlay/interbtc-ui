
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
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
import Chains from 'components/Chains';
import TokenField from 'components/TokenField';
import ErrorFallback from 'components/ErrorFallback';
import FormTitle from 'components/FormTitle';
import SubmitButton from 'components/SubmitButton';

const CrossChainTransferForm = (): JSX.Element => {
  const { t } = useTranslation();

  const {
    collateralTokenTransferableBalance
  } = useSelector((state: StoreType) => state.general);

  return (
    <form className='space-y-8'>
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
        <Chains />
      </div>
      <div>
        <Chains />
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

