
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { toast } from 'react-toastify';

import InterBTCField from '../InterBTCField';
import TextField from 'components/TextField';
import InterlayModal, {
  InterlayModalTitle,
  InterlayModalInnerWrapper
} from 'components/UI/InterlayModal';
import InterlayButton from 'components/UI/InterlayButton';
import ErrorModal from 'components/ErrorModal';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import {
  getUsdAmount,
  updateBalances
} from 'common/utils/utils';
import { updateBalanceInterBTCAction } from 'common/actions/general.actions';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as AcalaLogoIcon } from 'assets/img/acala-logo.svg';
import { ReactComponent as PlasmLogoIcon } from 'assets/img/plasm-logo.svg';
import { ReactComponent as EthereumLogoIcon } from 'assets/img/ethereum-logo.svg';
import { ReactComponent as CosmosLogoIcon } from 'assets/img/cosmos-logo.svg';

const POLKA_BTC_AMOUNT = 'polka-btc-amount';
const DOT_ADDRESS = 'dot-address';

type TransferForm = {
  [POLKA_BTC_AMOUNT]: string;
  [DOT_ADDRESS]: string;
}

const NETWORK_TYPES = Object.freeze({
  interBTC: 'polka-btc',
  acala: 'acala',
  plasm: 'plasm',
  ethereum: 'ethereum',
  cosmos: 'cosmos'
});

const NETWORK_ITEMS = [
  {
    type: NETWORK_TYPES.interBTC,
    icon: (
      <InterBTCLogoIcon width={24} />
    ),
    title: 'InterBTC'
  },
  {
    type: NETWORK_TYPES.acala,
    icon: (
      <AcalaLogoIcon
        width={20}
        height={20} />
    ),
    title: 'Acala',
    disabled: true
  },
  {
    type: NETWORK_TYPES.plasm,
    icon: (
      <PlasmLogoIcon
        width={20}
        height={20} />
    ),
    title: 'Plasm',
    disabled: true
  },
  {
    type: NETWORK_TYPES.ethereum,
    icon: (
      <EthereumLogoIcon
        width={20}
        height={20} />
    ),
    title: 'Ethereum',
    disabled: true
  },
  {
    type: NETWORK_TYPES.cosmos,
    icon: (
      <CosmosLogoIcon
        width={20}
        height={20} />
    ),
    title: 'Cosmos',
    disabled: true
  }
];

const Transfer = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
  const {
    balanceInterBTC,
    balanceDOT,
    parachainStatus
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<TransferForm>({
    mode: 'onChange'
  });
  const interBTCAmount = watch(POLKA_BTC_AMOUNT);

  const [networkModalOpen, setNetworkModalOpen] = React.useState(false);
  const [selectedNetworkType, setSelectedNetworkType] = React.useState(NETWORK_TYPES.interBTC);

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  const handleNetworkModalOpen = () => {
    setNetworkModalOpen(true);
  };

  const handleNetworkModalClose = () => {
    setNetworkModalOpen(false);
  };

  const onSubmit = async (data: TransferForm) => {
    try {
      setSubmitStatus(STATUSES.PENDING);
      await window.interBTC.treasury.transfer(data[DOT_ADDRESS], new Big(data[POLKA_BTC_AMOUNT]));
      // TODO: should be managed by a dedicated cache mechanism
      dispatch(updateBalanceInterBTCAction(new Big(balanceInterBTC).sub(new Big(data[POLKA_BTC_AMOUNT])).toString()));
      updateBalances(dispatch, data[DOT_ADDRESS], balanceDOT, balanceInterBTC);
      setSubmitStatus(STATUSES.RESOLVED);
      toast.success(t('transfer_page.successfully_transferred'));
      reset({
        [POLKA_BTC_AMOUNT]: '',
        [DOT_ADDRESS]: ''
      });
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const validateInterBTCAmount = (value: number): string | undefined => {
    if (Number(balanceInterBTC) === 0) {
      return t('insufficient_funds');
    }

    if (Number(balanceDOT) === 0) {
      return t('insufficient_funds_dot');
    }

    if (value > Number(balanceInterBTC)) {
      return `${t('redeem_page.current_balance')}${balanceInterBTC}`;
    }

    return undefined;
  };

  const selectedNetworkItem = NETWORK_ITEMS.find(networkItem => networkItem.type === selectedNetworkType);
  if (!selectedNetworkItem) {
    throw new Error('Something went wrong!'); // TODO: hardcoded
  }

  return (
    <>
      <form
        className='space-y-8'
        onSubmit={handleSubmit(onSubmit)}>
        <h4
          className={clsx(
            'font-medium',
            'text-center',
            'text-interlayDodgerBlue'
          )}>
          {t('transfer_page.transfer_interbtc')}
        </h4>
        <InterBTCField
          id='polka-btc-amount'
          name={POLKA_BTC_AMOUNT}
          type='number'
          label='InterBTC'
          step='any'
          placeholder='0.00'
          ref={register({
            required: {
              value: true,
              message: t('redeem_page.please_enter_amount')
            },
            validate: value => validateInterBTCAmount(value)
          })}
          approxUSD={`≈ $ ${getUsdAmount(interBTCAmount || '0.00', usdPrice)}`}
          error={!!errors[POLKA_BTC_AMOUNT]}
          helperText={errors[POLKA_BTC_AMOUNT]?.message} />
        <div>
          <TextField
            id='dot-address'
            name={DOT_ADDRESS}
            type='text'
            label={t('recipient')}
            placeholder={t('recipient_account')}
            ref={register({
              required: {
                value: true,
                message: t('enter_recipient_address')
              }
            })}
            error={!!errors[DOT_ADDRESS]}
            helperText={errors[DOT_ADDRESS]?.message} />
          {/* TODO: should be a drop-down */}
          <InterlayButton
            style={{ display: 'flex' }}
            className={clsx(
              'ml-auto',
              'mt-2'
            )}
            variant='outlined'
            color='primary'
            startIcon={selectedNetworkItem.icon}
            onClick={handleNetworkModalOpen}>
            {selectedNetworkItem.title}
          </InterlayButton>
        </div>
        <InterlayButton
          type='submit'
          style={{ display: 'flex' }}
          className='mx-auto'
          variant='contained'
          color='primary'
          disabled={
            parachainStatus !== ParachainStatus.Running ||
            !!selectedNetworkItem.disabled
          }
          pending={submitStatus === STATUSES.PENDING}>
          {selectedNetworkItem.disabled ? t('coming_soon') : t('transfer')}
        </InterlayButton>
      </form>
      <InterlayModal
        open={networkModalOpen}
        onClose={handleNetworkModalClose}>
        <InterlayModalInnerWrapper
          className={clsx(
            'max-w-sm',
            'space-y-4'
          )}>
          <InterlayModalTitle
            as='h3'
            className={clsx(
              'text-md',
              'font-medium'
            )}>
            Select a network
          </InterlayModalTitle>
          <div className='space-y-2'>
            {NETWORK_ITEMS.map(networkItem => (
              <InterlayButton
                key={networkItem.type}
                variant='outlined'
                color='default'
                className='w-full'
                startIcon={networkItem.icon}
                onClick={() => {
                  setSelectedNetworkType(networkItem.type);
                  handleNetworkModalClose();
                }}>
                {networkItem.title}
              </InterlayButton>
            ))}
          </div>
        </InterlayModalInnerWrapper>
      </InterlayModal>
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

export default Transfer;
