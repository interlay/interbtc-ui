
import * as React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { AccountId } from '@polkadot/types/interfaces';
import { btcToSat } from '@interlay/polkabtc';

import SubmittedIssueRequestModal from './SubmittedIssueRequestModal';
import InterBTCField from 'pages/Home/InterBTCField';
import PriceInfo from 'pages/Home/PriceInfo';
import ParachainStatusInfo from 'pages/Home/ParachainStatusInfo';
import Tooltip from 'components/Tooltip';
import EllipsisLoader from 'components/EllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorFallback from 'components/ErrorFallback';
import InterlayDenimContainedButton from 'components/buttons/InterlayDenimContainedButton';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import {
  BLOCK_TIME,
  BLOCKS_BEHIND_LIMIT
} from 'config/parachain';
import {
  addIssueRequestAction,
  updateIssuePeriodAction
} from 'common/actions/issue.actions';
import { showAccountModalAction } from 'common/actions/general.actions';
import {
  displayBtcAmount,
  displayDotAmount,
  getRandomVaultIdWithCapacity,
  getUsdAmount
} from 'common/utils/utils';
import { parachainToUIIssueRequest } from 'common/utils/requests';
import STATUSES from 'utils/constants/statuses';
import { IssueRequest } from 'common/types/issue.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';

const BTC_AMOUNT = 'btc-amount';

// TODO: should handle correctly later
const EXTRA_REQUIRED_DOT_AMOUNT = 0.2;
const MAXIMUM_ISSUABLE_POLKA_BTC_AMOUNT = 1;

type IssueFormData = {
  [BTC_AMOUNT]: string;
}

const IssueForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleError = useErrorHandler();

  const {
    polkaBtcLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    parachainStatus,
    balanceDOT,
    extensions
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IssueFormData>({
    mode: 'onChange' // 'onBlur'
  });
  const btcAmount = watch(BTC_AMOUNT);

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  // Additional info: bridge fee, security deposit, amount BTC
  // Current fee model specification taken from: https://interlay.gitlab.io/polkabtc-spec/spec/fee.html
  const [feeRate, setFeeRate] = React.useState(new Big(0.005)); // Set default to 0.5%
  const [depositRate, setDepositRate] = React.useState(new Big(0.00005)); // Set default to 0.005%
  const [btcToDOTRate, setBTCToDOTRate] = React.useState(new Big(0));
  const [vaults, setVaults] = React.useState<Map<AccountId, Big>>();
  const [dustValue, setDustValue] = React.useState('0');
  const [vaultMaxAmount, setVaultMaxAmount] = React.useState('');
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<IssueRequest>();

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!dispatch) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          theFeeRate,
          theDepositRate,
          issuePeriodInBlocks,
          theDustValue,
          btcToDot,
          theVaults
        ] = await Promise.all([
          // Loading this data is not strictly required as long as the constantly set values did
          // not change. However, you will not see the correct value for the security deposit.
          window.polkaBTC.issue.getFeeRate(),
          window.polkaBTC.fee.getIssueGriefingCollateralRate(),
          window.polkaBTC.issue.getIssuePeriod(),
          window.polkaBTC.redeem.getDustValue(),
          window.polkaBTC.oracle.getExchangeRate(),
          // This data (the vaults) is strictly required to request issue
          window.polkaBTC.vaults.getVaultsWithIssuableTokens()
        ]);
        setStatus(STATUSES.RESOLVED);

        setFeeRate(theFeeRate);
        setDepositRate(theDepositRate);
        const issuePeriod = issuePeriodInBlocks * BLOCK_TIME;
        dispatch(updateIssuePeriodAction(issuePeriod));
        setDustValue(theDustValue.toString());
        setBTCToDOTRate(btcToDot);

        let theVaultMaxAmount = new Big(0);
        // The first item is the vault with the largest capacity
        theVaultMaxAmount = theVaults.values().next().value;

        setVaultMaxAmount(theVaultMaxAmount.toString());
        setVaults(theVaults);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    polkaBtcLoaded,
    dispatch,
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

  const validateBTCAmount = (value = 0): string | undefined => {
    const bigBTCAmount = new Big(value);

    const securityDeposit = bigBTCAmount.mul(btcToDOTRate).mul(depositRate);
    const minimumRequiredDOTAmount = new Big(EXTRA_REQUIRED_DOT_AMOUNT).add(securityDeposit);
    if (new Big(balanceDOT) <= minimumRequiredDOTAmount) {
      return t('insufficient_funds_dot');
    }

    if (value > MAXIMUM_ISSUABLE_POLKA_BTC_AMOUNT) {
      return t('issue_page.validation_max_value');
    } else if (bigBTCAmount < new Big(dustValue)) {
      return `${t('issue_page.validation_min_value')}${dustValue} BTC).`;
    }

    const vaultId = getRandomVaultIdWithCapacity(Array.from(vaults || new Map()), bigBTCAmount);
    if (!vaultId) {
      return t('issue_page.maximum_in_single_request', {
        maxAmount: parseFloat(Number(vaultMaxAmount).toFixed(5))
      });
    }

    if (bitcoinHeight - btcRelayHeight > BLOCKS_BEHIND_LIMIT) {
      return t('issue_page.error_more_than_6_blocks_behind');
    }

    if (!polkaBtcLoaded) {
      return 'InterBTC must be loaded!';
    }

    if (btcToSat(value.toString()) === undefined) {
      return 'Invalid BTC amount input!';
    }

    return undefined;
  };

  const handleSubmittedRequestModalOpen = (newSubmittedRequest: IssueRequest) => {
    setSubmittedRequest(newSubmittedRequest);
  };
  const handleSubmittedRequestModalClose = () => {
    setSubmittedRequest(undefined);
  };

  const onSubmit = async (data: IssueFormData) => {
    try {
      const interBTCAmount = new Big(data[BTC_AMOUNT]);
      setSubmitStatus(STATUSES.PENDING);
      const result = await window.polkaBTC.issue.request(interBTCAmount);
      // TODO: handle issue aggregation
      const theSubmittedRequest = await parachainToUIIssueRequest(result[0].id, result[0].issueRequest);
      handleSubmittedRequestModalOpen(theSubmittedRequest);
      setSubmitStatus(STATUSES.RESOLVED);

      dispatch(addIssueRequestAction(theSubmittedRequest));
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  if (status === STATUSES.RESOLVED) {
    const bigBTCAmount = new Big(btcAmount || 0);
    const bridgeFee = bigBTCAmount.mul(feeRate);
    const securityDeposit = bigBTCAmount.mul(btcToDOTRate).mul(depositRate);
    const interBTCAmount = bigBTCAmount.sub(bridgeFee);

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
            {t('issue_page.mint_polka_by_wrapping')}
          </h4>
          <InterBTCField
            id='btc-amount'
            name={BTC_AMOUNT}
            type='number'
            label='BTC'
            step='any'
            placeholder='0.00'
            min={0}
            ref={register({
              required: {
                value: true,
                message: t('issue_page.enter_valid_amount')
              },
              validate: value => validateBTCAmount(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(btcAmount || '0', prices.bitcoin.usd)}`}
            error={!!errors[BTC_AMOUNT]}
            helperText={errors[BTC_AMOUNT]?.message} />
          <ParachainStatusInfo status={parachainStatus} />
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
            value={displayBtcAmount(bridgeFee)}
            unitName='BTC'
            approxUSD={getUsdAmount(bridgeFee, prices.bitcoin.usd)}
            tooltip={
              <Tooltip overlay={t('issue_page.tooltip_bridge_fee')}>
                <HiOutlineExclamationCircle className='text-textSecondary' />
              </Tooltip>
            } />
          <PriceInfo
            title={
              <h5 className='text-textSecondary'>
                {t('issue_page.security_deposit')}
              </h5>
            }
            unitIcon={
              <PolkadotLogoIcon
                width={20}
                height={20} />
            }
            value={displayDotAmount(securityDeposit)}
            unitName='DOT'
            approxUSD={getUsdAmount(securityDeposit, prices.polkadot.usd)}
            tooltip={
              <Tooltip overlay={t('issue_page.tooltip_security_deposit')}>
                <HiOutlineExclamationCircle className='text-textSecondary' />
              </Tooltip>
            } />
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
              <InterBTCLogoIcon
                width={23}
                height={23} />
            }
            value={displayBtcAmount(interBTCAmount)}
            unitName='InterBTC'
            approxUSD={getUsdAmount(interBTCAmount, prices.bitcoin.usd)} />
          <InterlayDenimContainedButton
            type='submit'
            style={{ display: 'flex' }}
            className='mx-auto'
            disabled={
              // TODO: `parachainStatus` and `address` should be checked at upper levels
              parachainStatus !== ParachainStatus.Running ||
              !address
            }
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
          <SubmittedIssueRequestModal
            open={!!submittedRequest}
            onClose={handleSubmittedRequestModalClose}
            request={submittedRequest} />
        )}
      </>
    );
  }

  return null;
};

export default withErrorBoundary(IssueForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
