
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
import { newMonetaryAmount } from '@interlay/interbtc-api';

import Accounts from 'components/Accounts';
import Chains from 'components/Chains';
import TokenField from 'components/TokenField';
import ErrorFallback from 'components/ErrorFallback';
import FormTitle from 'components/FormTitle';
import SubmitButton from 'components/SubmitButton';
import ErrorModal from 'components/ErrorModal';
import {
  COLLATERAL_TOKEN,
  COLLATERAL_TOKEN_SYMBOL
} from 'config/relay-chains';
import { showAccountModalAction } from 'common/actions/general.actions';
import { getUsdAmount } from 'common/utils/utils';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import { ChainType } from 'types/chains.types';
import STATUSES from 'utils/constants/statuses';
import { xcmTransfer } from 'utils/relay-chain-api/transfer';

const TRANSFER_AMOUNT = 'transfer-amount';

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
}

const CrossChainTransferForm = (): JSX.Element => {
  const [destination, setDestination] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  // TODO: this could be removed form state using React hook form getValue/watch
  const [approxUsdValue, setApproxUsdValue] = React.useState<string>('0');

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
    parachainStatus,
    address,
    prices
  } = useSelector((state: StoreType) => state.general);

  const onSubmit = async (data: CrossChainTransferFormData) => {
    if (!address) return;
    if (!destination) return;

    try {
      setSubmitStatus(STATUSES.PENDING);

      await xcmTransfer(
        address,
        destination.address,
        newMonetaryAmount(data[TRANSFER_AMOUNT], COLLATERAL_TOKEN, true)
      );

      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!address) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

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

  const handleValueChange = (event: any) => {
    const value = newMonetaryAmount(event.target.value, COLLATERAL_TOKEN, true);
    const usd = getUsdAmount(value, prices.collateralToken.usd);

    setApproxUsdValue(usd);
  };

  return (
    <>
      <form
        className='space-y-8'
        onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>
          {t('transfer_page.cross_chain_transfer_form.title')}
        </FormTitle>
        <TokenField
          onChange={handleValueChange}
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
          approxUSD={`≈ $ ${approxUsdValue}`} />
        <Chains
          label={t('transfer_page.cross_chain_transfer_form.from_chain')}
          defaultChain={ChainType.RelayChain} />
        <Chains
          label={t('transfer_page.cross_chain_transfer_form.to_chain')}
          defaultChain={ChainType.Parachain} />

        <Accounts
          label={t('transfer_page.cross_chain_transfer_form.target_account')}
          callbackFunction={setDestination} />
        <SubmitButton
          disabled={
            parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)
          }
          pending={submitStatus === STATUSES.PENDING}
          onClick={handleConfirmClick}>
          {address ? (
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
