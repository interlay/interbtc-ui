import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { AccountId } from '@polkadot/types/interfaces/runtime';
import {
  btcToSat, Redeem
} from '@interlay/interbtc';

import SubmittedRedeemRequestModal from './SubmittedRedeemRequestModal';
import InterBTCField from 'pages/Home/InterBTCField';
import PriceInfo from 'pages/Home/PriceInfo';
import ParachainStatusInfo from 'pages/Home/ParachainStatusInfo';
import Tooltip from 'components/Tooltip';
import Toggle from 'components/Toggle';
import TextField from 'components/TextField';
import EllipsisLoader from 'components/EllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorFallback from 'components/ErrorFallback';
import InterlayDenimContainedButton from 'components/buttons/InterlayDenimContainedButton';

import {
  BALANCE_MAX_INTEGER_LENGTH,
  BTC_ADDRESS_REGEX
} from '../../../constants';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { BLOCKS_BEHIND_LIMIT } from 'config/parachain';
import {
  displayBtcAmount,
  getUsdAmount,
  getRandomVaultIdWithCapacity
} from 'common/utils/utils';
import STATUSES from 'utils/constants/statuses';
import { togglePremiumRedeemAction } from 'common/actions/redeem.actions';
import { showAccountModalAction } from 'common/actions/general.actions';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';

const INTER_BTC_AMOUNT = 'inter-btc-amount';
const BTC_ADDRESS = 'btc-address';

type RedeemFormData = {
  [INTER_BTC_AMOUNT]: string;
  [BTC_ADDRESS]: string;
}

const RedeemForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const interbtcIndex = useInterbtcIndex();

  const handleError = useErrorHandler();

  const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
  const {
    balancePolkaBTC,
    polkaBtcLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    parachainStatus,
    extensions
  } = useSelector((state: StoreType) => state.general);
  const premiumRedeemSelected = useSelector((state: StoreType) => state.redeem.premiumRedeem);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError: setFormError
  } = useForm<RedeemFormData>({
    mode: 'onChange'
  });
  const interBTCAmount = watch(INTER_BTC_AMOUNT);

  const [dustValue, setDustValue] = React.useState(0);
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [redeemFee, setRedeemFee] = React.useState('0');
  const [redeemFeeRate, setRedeemFeeRate] = React.useState(new Big(0.005));
  const [btcToDotRate, setBtcToDotRate] = React.useState(new Big(0));
  const [premiumRedeemVaults, setPremiumRedeemVaults] = React.useState<Map<AccountId, Big>>(new Map());
  const [premiumRedeemFee, setPremiumRedeemFee] = React.useState(0);
  const [currentInclusionFee, setCurrentInclusionFee] = React.useState(new Big(0));
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<Redeem>();

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!interBTCAmount) return;
    if (!redeemFeeRate) return;

    const bigPolkaBTCAmount = new Big(interBTCAmount);
    const theRedeemFee = bigPolkaBTCAmount.mul(redeemFeeRate);
    setRedeemFee(theRedeemFee.toString());
  }, [
    polkaBtcLoaded,
    interBTCAmount,
    redeemFeeRate
  ]);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          dustValueResult,
          premiumRedeemVaultsResult,
          premiumRedeemFeeResult,
          btcToDotRateResult,
          redeemFeeRateResult,
          currentInclusionFeeResult
        ] = await Promise.allSettled([
          interbtcIndex.getDustValue(),
          window.polkaBTC.vaults.getPremiumRedeemVaults(),
          interbtcIndex.getPremiumRedeemFee(),
          window.polkaBTC.oracle.getExchangeRate(),
          window.polkaBTC.redeem.getFeeRate(),
          window.polkaBTC.redeem.getCurrentInclusionFee()
        ]);

        if (dustValueResult.status === 'rejected') {
          throw new Error(dustValueResult.reason);
        }
        if (premiumRedeemFeeResult.status === 'rejected') {
          throw new Error(premiumRedeemFeeResult.reason);
        }
        if (btcToDotRateResult.status === 'rejected') {
          throw new Error(btcToDotRateResult.reason);
        }
        if (redeemFeeRateResult.status === 'rejected') {
          throw new Error(redeemFeeRateResult.reason);
        }
        if (currentInclusionFeeResult.status === 'rejected') {
          throw new Error(currentInclusionFeeResult.reason);
        }
        if (premiumRedeemVaultsResult.status === 'fulfilled') {
          setPremiumRedeemVaults(premiumRedeemVaultsResult.value);
        }

        setDustValue(dustValueResult.value);
        setPremiumRedeemFee(premiumRedeemFeeResult.value);
        setBtcToDotRate(btcToDotRateResult.value);
        setRedeemFeeRate(redeemFeeRateResult.value);
        setCurrentInclusionFee(currentInclusionFeeResult.value);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    interbtcIndex,
    polkaBtcLoaded,
    handleError
  ]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayDenim-400' />
      </div>
    );
  }

  if (status === STATUSES.RESOLVED) {
    const handleSubmittedRequestModalOpen = (newSubmittedRequest: Redeem) => {
      setSubmittedRequest(newSubmittedRequest);
    };
    const handleSubmittedRequestModalClose = () => {
      setSubmittedRequest(undefined);
    };

    const onSubmit = async (data: RedeemFormData) => {
      try {
        setSubmitStatus(STATUSES.PENDING);
        const interBTCAmount = new Big(data[INTER_BTC_AMOUNT]);

        // Differentiate between premium and regular redeem
        let vaultId;
        if (premiumRedeemSelected) {
          // Select a vault from the premium redeem vault list
          for (const [id, redeemableTokens] of premiumRedeemVaults) {
            if (redeemableTokens >= interBTCAmount) {
              vaultId = id;
              break;
            }
          }
          if (vaultId === undefined) {
            let maxAmount = new Big(0);
            for (const redeemableTokens of premiumRedeemVaults.values()) {
              if (maxAmount < redeemableTokens) {
                maxAmount = redeemableTokens;
              }
            }
            setFormError(INTER_BTC_AMOUNT, {
              type: 'manual',
              message: t('redeem_page.error_max_premium_redeem', { maxPremiumRedeem: maxAmount.toString() })
            });

            return;
          }
        } else {
          const vaults = await window.polkaBTC.vaults.getVaultsWithRedeemableTokens();
          vaultId = getRandomVaultIdWithCapacity(Array.from(vaults || new Map()), interBTCAmount);
        }

        // FIXME: workaround to make premium redeem still possible
        const relevantVaults = new Map<AccountId, Big>();
        const id = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vaultId);
        // FIXME: a bit of a dirty workaround with the capacity
        relevantVaults.set(id, interBTCAmount.mul(2));
        const result = await window.polkaBTC.redeem.request(
          interBTCAmount,
          data[BTC_ADDRESS],
          id
        );

        // TODO: handle redeem aggregator
        const redeemRequest = result[0];
        handleSubmittedRequestModalOpen(redeemRequest);
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const validateForm = (value: number): string | undefined => {
      const bigValue = new Big(value);
      const minValue = new Big(dustValue).add(currentInclusionFee).add(new Big(redeemFee));
      if (bigValue.gt(new Big(balancePolkaBTC))) {
        return `${t('redeem_page.current_balance')}${balancePolkaBTC}`;
      } else if (bigValue.lte(minValue)) {
        return `${t('redeem_page.amount_greater_dust_inclusion')}${minValue} BTC).`;
      }

      if (!address) {
        return t('redeem_page.must_select_account_warning');
      }

      if (!polkaBtcLoaded) {
        return 'InterBTC must be loaded!';
      }

      if (bitcoinHeight - btcRelayHeight > BLOCKS_BEHIND_LIMIT) {
        return t('redeem_page.error_more_than_6_blocks_behind');
      }

      if (btcToSat(new Big(value)) === undefined) {
        return 'Invalid InterBTC amount input!';
      }

      const polkaBTCAmountInteger = value.toString().split('.')[0];
      if (polkaBTCAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
        return 'Input value is too high!';
      }

      return undefined;
    };

    const handlePremiumRedeemToggle = () => {
      // TODO: should not use redux
      dispatch(togglePremiumRedeemAction(!premiumRedeemSelected));
    };

    const redeemFeeInBTC = displayBtcAmount(redeemFee);
    const redeemFeeInUSD = getUsdAmount(redeemFee, prices.bitcoin.usd);

    const totalBTC =
        interBTCAmount ?
          displayBtcAmount(new Big(interBTCAmount).sub(new Big(redeemFee)).sub(currentInclusionFee)) :
          '0';
    const totalBTCInUSD = getUsdAmount(totalBTC, prices.bitcoin.usd);

    const totalDOT =
      interBTCAmount ?
        new Big(interBTCAmount).mul(btcToDotRate).mul(premiumRedeemFee).toString() :
        '0';
    const totalDOTInUSD = getUsdAmount(totalDOT, prices.polkadot.usd);

    const bitcoinNetworkFeeInBTC = displayBtcAmount(currentInclusionFee);
    const bitcoinNetworkFeeInUSD = getUsdAmount(currentInclusionFee, prices.bitcoin.usd);

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
            {t('redeem_page.you_will_receive')}
          </h4>
          <InterBTCField
            id={INTER_BTC_AMOUNT}
            name={INTER_BTC_AMOUNT}
            type='number'
            label='InterBTC'
            step='any'
            placeholder='0.00'
            min={0}
            ref={register({
              required: {
                value: true,
                message: t('redeem_page.please_enter_amount')
              },
              validate: value => validateForm(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(interBTCAmount || '0', usdPrice)}`}
            error={!!errors[INTER_BTC_AMOUNT]}
            helperText={errors[INTER_BTC_AMOUNT]?.message} />
          <ParachainStatusInfo status={parachainStatus} />
          <TextField
            id='btc-address'
            name={BTC_ADDRESS}
            type='text'
            label='BTC Address'
            placeholder={t('enter_btc_address')}
            ref={register({
              required: {
                value: true,
                message: t('redeem_page.enter_btc')
              },
              pattern: {
                value: BTC_ADDRESS_REGEX, // TODO: regex need to depend on global mainnet | testnet parameter
                message: t('redeem_page.valid_btc_address')
              }
            })}
            error={!!errors[BTC_ADDRESS]}
            helperText={errors[BTC_ADDRESS]?.message} />
          {premiumRedeemVaults.size > 0 && (
            <div
              className={clsx(
                'flex',
                'justify-center',
                'items-center',
                'space-x-4'
              )}>
              <div
                className={clsx(
                  'flex',
                  'items-center',
                  'space-x-1'
                )}>
                <span>{t('redeem_page.premium_redeem')}</span>
                <Tooltip overlay={t('redeem_page.premium_redeem_info')}>
                  <FaExclamationCircle />
                </Tooltip>
              </div>
              <Toggle
                checked={premiumRedeemSelected}
                onChange={handlePremiumRedeemToggle} />
            </div>
          )}
          <PriceInfo
            title={
              <h5 className='text-textSecondary'>
                {t('bridge_fee')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={redeemFeeInBTC}
            unitName='BTC'
            approxUSD={redeemFeeInUSD} />
          <PriceInfo
            title={
              <h5 className='text-textSecondary'>
                {t('bitcoin_network_fee')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={bitcoinNetworkFeeInBTC}
            unitName='BTC'
            approxUSD={bitcoinNetworkFeeInUSD} />
          <hr
            className={clsx(
              'border-t-2',
              'my-2.5',
              'border-textSecondary'
            )} />
          <PriceInfo
            title={
              <h5 className='text-textPrimary'>
                {t('you_will_receive')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={totalBTC}
            unitName='BTC'
            approxUSD={totalBTCInUSD} />
          {premiumRedeemSelected && (
            <PriceInfo
              title={
                <h5 className='text-interlayConifer'>
                  {t('redeem_page.earned_premium')}
                </h5>
              }
              unitIcon={
                <PolkadotLogoIcon
                  width={23}
                  height={23} />
              }
              value={totalDOT}
              unitName='DOT'
              approxUSD={totalDOTInUSD} />
          )}
          <InterlayDenimContainedButton
            type='submit'
            style={{ display: 'flex' }}
            className='mx-auto'
            disabled={parachainStatus !== ParachainStatus.Running}
            pending={submitStatus === STATUSES.PENDING}
            onClick={handleConfirmClick}>
            {walletConnected ? t('confirm') : t('connect_wallet')}
          </InterlayDenimContainedButton>
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
        {submittedRequest && (
          <SubmittedRedeemRequestModal
            open={!!submittedRequest}
            onClose={handleSubmittedRequestModalClose}
            request={submittedRequest} />
        )}
      </>
    );
  }

  return null;
};

export default withErrorBoundary(RedeemForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
