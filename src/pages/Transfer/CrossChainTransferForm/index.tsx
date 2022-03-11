
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import AvailableBalanceUI from 'components/AvailableBalanceUI';
import Accounts from 'components/Accounts';
import Chains, {
  ChainOption,
  getChain } from 'components/Chains';
import TokenField from 'components/TokenField';
import ErrorFallback from 'components/ErrorFallback';
import FormTitle from 'components/FormTitle';
import SubmitButton from 'components/SubmitButton';
import ErrorModal from 'components/ErrorModal';
import { COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
import { showAccountModalAction } from 'common/actions/general.actions';
import { displayMonetaryAmount } from 'common/utils/utils';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import { ChainType } from 'common/types/chains.types';
import STATUSES from 'utils/constants/statuses';

const TRANSFER_AMOUNT = 'transfer-amount';

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
}

const CrossChainTransferForm = (): JSX.Element => {
  const [fromChain, setFromChain] = React.useState<ChainOption | undefined>(undefined);
  const [toChain, setToChain] = React.useState<ChainOption | undefined>(undefined);
  const [destination, setDestination] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [accountSet, setAccountSet] = React.useState<boolean | undefined>(undefined);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CrossChainTransferFormData>({
    mode: 'onChange'
  });

  const {
    collateralTokenTransferableBalance,
    parachainStatus,
    address
  } = useSelector((state: StoreType) => state.general);

  const onSubmit = (data: CrossChainTransferFormData) => {
    try {
      setSubmitStatus(STATUSES.PENDING);

      // await api call
      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
    console.log(data, destination, fromChain, toChain, address);
  };

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!accountSet) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  React.useEffect(() => {
    if (!toChain) return;

    const targetChain = toChain.type === ChainType.Relaychain ? ChainType.Parachain : ChainType.Relaychain;
    setFromChain(getChain(targetChain));
  }, [toChain]);

  React.useEffect(() => {
    setAccountSet(!!address);
  }, [address]);

  // This ensures that triggering the notification and clearing
  // the form happen at the same time.
  React.useEffect(() => {
    if (submitStatus !== STATUSES.RESOLVED) return;

    toast.success(t('transfer_page.successfully_transferred'));

    reset({
      [TRANSFER_AMOUNT]: ''
    });
  }, [
    submitStatus,
    reset,
    t
  ]);

  return (
    <>
      <form
        className='space-y-8'
        onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>
          {t('transfer_page.cross_chain_transfer_form.title')}
        </FormTitle>
        <div>
          {fromChain?.type === ChainType.Parachain && (
            <AvailableBalanceUI
              label={t('transfer_page.cross_chain_transfer_form.balance')}
              balance={displayMonetaryAmount(collateralTokenTransferableBalance)}
              tokenSymbol={COLLATERAL_TOKEN_SYMBOL} />
          )}
          <div>
            <TokenField
              id={TRANSFER_AMOUNT}
              name={TRANSFER_AMOUNT}
              ref={register({
                required: {
                  value: true,
                  message: t('transfer_page.cross_chain_transfer_form.please_enter_amount')
                }
              })}
              error={!!errors[TRANSFER_AMOUNT]}
              helperText={errors[TRANSFER_AMOUNT]?.message}
              label={COLLATERAL_TOKEN_SYMBOL}
              approxUSD='≈ $ 0' />
          </div>
        </div>
        <div className='capitalize'>
          {t('transfer_page.cross_chain_transfer_form.from_chain', { fromChain: fromChain?.name })}
        </div>
        <div>
          <Chains
            label={t('transfer_page.cross_chain_transfer_form.to_chain')}
            callbackFunction={setToChain}
            defaultChain={ChainType.Parachain} />
        </div>
        <div>
          <Accounts
            label={t('transfer_page.cross_chain_transfer_form.target_account')}
            callbackFunction={setDestination} />
        </div>
        <SubmitButton
          disabled={
            parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)
          }
          pending={submitStatus === STATUSES.PENDING}
          onClick={handleConfirmClick}>
          {accountSet ? (
            t('transfer')
          ) : (
            t('connect_wallet')
          )}
        </SubmitButton>
      </form>
      {(submitStatus === STATUSES.REJECTED && submitError) && (
        <ErrorModal
          open={!!submitError}
          onClose={() => {
            setSubmitStatus(STATUSES.IDLE);
            setSubmitError(null);
          }}
          title='Error'
          description={
            typeof submitError === 'string' ?
              submitError :
              submitError.message
          } />
      )}
    </>
  );
};

export default withErrorBoundary(CrossChainTransferForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});

