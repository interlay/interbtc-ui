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
import InterlayDenimContainedButton from 'components/buttons/InterlayDenimContainedButton';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayDefaultOutlinedButton from 'components/buttons/InterlayDefaultOutlinedButton';
import ErrorModal from 'components/ErrorModal';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import { getUsdAmount } from 'common/utils/utils';
import { showAccountModalAction } from 'common/actions/general.actions';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as AcalaLogoIcon } from 'assets/img/acala-logo.svg';
import { ReactComponent as PlasmLogoIcon } from 'assets/img/plasm-logo.svg';
import { ReactComponent as EthereumLogoIcon } from 'assets/img/ethereum-logo.svg';
import { ReactComponent as CosmosLogoIcon } from 'assets/img/cosmos-logo.svg';
import { CurrencyIdLiteral } from '@interlay/interbtc';

const INTER_BTC_AMOUNT = 'inter-btc-amount';
const DOT_ADDRESS = 'dot-address';

type TransferFormData = {
  [INTER_BTC_AMOUNT]: string;
  [DOT_ADDRESS]: string;
}

const NETWORK_TYPES = Object.freeze({
  polkaBTC: 'inter-btc',
  acala: 'acala',
  plasm: 'plasm',
  ethereum: 'ethereum',
  cosmos: 'cosmos'
});

const NETWORK_ITEMS = [
  {
    type: NETWORK_TYPES.polkaBTC,
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

const TransferForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
  const {
    balancePolkaBTC,
    balanceDOT,
    parachainStatus,
    extensions
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<TransferFormData>({
    mode: 'onChange'
  });
  const interBTCAmount = watch(INTER_BTC_AMOUNT);

  const [networkModalOpen, setNetworkModalOpen] = React.useState(false);
  const [selectedNetworkType, setSelectedNetworkType] = React.useState(NETWORK_TYPES.polkaBTC);

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  const handleNetworkModalOpen = () => {
    setNetworkModalOpen(true);
  };

  const handleNetworkModalClose = () => {
    setNetworkModalOpen(false);
  };

  const onSubmit = async (data: TransferFormData) => {
    try {
      setSubmitStatus(STATUSES.PENDING);
      await window.polkaBTC.tokens.transfer(
        CurrencyIdLiteral.INTERBTC,
        data[DOT_ADDRESS],
        new Big(data[INTER_BTC_AMOUNT])
      );
      setSubmitStatus(STATUSES.RESOLVED);
      toast.success(t('transfer_page.successfully_transferred'));
      reset({
        [INTER_BTC_AMOUNT]: '',
        [DOT_ADDRESS]: ''
      });
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const validateForm = (value: number): string | undefined => {
    if (Number(balancePolkaBTC) === 0) {
      return t('insufficient_funds');
    }

    if (Number(balanceDOT) === 0) {
      return t('insufficient_funds_dot');
    }

    if (value > Number(balancePolkaBTC)) {
      return `${t('redeem_page.current_balance')}${balancePolkaBTC}`;
    }

    return undefined;
  };

  const selectedNetworkItem = NETWORK_ITEMS.find(networkItem => networkItem.type === selectedNetworkType);
  if (!selectedNetworkItem) {
    throw new Error('Something went wrong!'); // TODO: hardcoded
  }

  const walletConnected = !!extensions.length;

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!walletConnected) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  return (
    <>
      <form
        className='space-y-8'
        onSubmit={handleSubmit(onSubmit)}>
        <h4
          className={clsx(
            'font-medium',
            'text-center',
            'text-interlayDenim'
          )}>
          {t('transfer_page.transfer_interbtc')}
        </h4>
        <InterBTCField
          id={INTER_BTC_AMOUNT}
          name={INTER_BTC_AMOUNT}
          type='number'
          label='InterBTC'
          step='any'
          placeholder='0.00'
          ref={register({
            required: {
              value: true,
              message: t('redeem_page.please_enter_amount')
            },
            validate: value => validateForm(value)
          })}
          approxUSD={`≈ $ ${getUsdAmount(interBTCAmount || '0.00', usdPrice)}`}
          error={!!errors[INTER_BTC_AMOUNT]}
          helperText={errors[INTER_BTC_AMOUNT]?.message} />
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
          <InterlayDenimOutlinedButton
            style={{ display: 'flex' }}
            className={clsx(
              'ml-auto',
              'mt-2'
            )}
            startIcon={selectedNetworkItem.icon}
            onClick={handleNetworkModalOpen}>
            {selectedNetworkItem.title}
          </InterlayDenimOutlinedButton>
        </div>
        <InterlayDenimContainedButton
          type='submit'
          style={{ display: 'flex' }}
          className='mx-auto'
          disabled={
            parachainStatus !== ParachainStatus.Running ||
            !!selectedNetworkItem.disabled
          }
          pending={submitStatus === STATUSES.PENDING}
          onClick={handleConfirmClick}>
          {walletConnected ? (
            selectedNetworkItem.disabled ? t('coming_soon') : t('transfer')
          ) : (
            t('connect_wallet')
          )}
        </InterlayDenimContainedButton>
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
              <InterlayDefaultOutlinedButton
                key={networkItem.type}
                className='w-full'
                startIcon={networkItem.icon}
                onClick={() => {
                  setSelectedNetworkType(networkItem.type);
                  handleNetworkModalClose();
                }}>
                {networkItem.title}
              </InterlayDefaultOutlinedButton>
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

export default TransferForm;
