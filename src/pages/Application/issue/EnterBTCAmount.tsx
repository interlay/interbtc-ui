
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
import { AccountId } from '@polkadot/types/interfaces';
import {
  btcToSat,
  stripHexPrefix
} from '@interlay/polkabtc';

import PolkaBTCField from '../PolkaBTCField';
import PriceInfo from '../PriceInfo';
import ParachainStatusInfo from '../ParachainStatusInfo';
import Tooltip from 'components/Tooltip';
import EllipsisLoader from 'components/EllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorHandler from 'components/ErrorHandler';
import InterlayButton from 'components/UI/InterlayButton';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import {
  BLOCK_TIME,
  BLOCKS_BEHIND_LIMIT
} from 'config/parachain';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  changeIssueStepAction,
  changeIssueIdAction,
  addIssueRequestAction,
  updateIssuePeriodAction
} from 'common/actions/issue.actions';
import {
  displayBtcAmount,
  displayDotAmount,
  getRandomVaultIdWithCapacity,
  getUsdAmount
} from 'common/utils/utils';
import { parachainToUIIssueRequest } from 'common/utils/requests';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';
import { ReactComponent as PolkaBTCLogoIcon } from 'assets/img/polkabtc-logo.svg';

const BTC_AMOUNT = 'btc-amount';

type IssueForm = {
  [BTC_AMOUNT]: string;
}

const EnterBTCAmount = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [error, setError] = React.useState<Error | null>(null);

  const {
    polkaBtcLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    parachainStatus
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IssueForm>({
    mode: 'onChange' // 'onBlur'
  });
  const btcAmount = watch(BTC_AMOUNT);

  // Additional info: bridge fee, security deposit, amount BTC
  // Current fee model specification taken from: https://interlay.gitlab.io/polkabtc-spec/spec/fee.html
  const [feeRate, setFeeRate] = React.useState(new Big(0.005)); // Set default to 0.5%
  const [depositRate, setDepositRate] = React.useState(new Big(0.00005)); // Set default to 0.005%
  const [btcToDotRate, setBtcToDotRate] = React.useState(new Big(0));
  const [bridgeFee, setBridgeFee] = React.useState(new Big(0));
  const [polkaBtcAmount, setPolkaBtcAmount] = React.useState(new Big(0));
  const [securityDeposit, setSecurityDeposit] = React.useState(new Big(0));
  const [vaults, setVaults] = React.useState<Map<AccountId, Big>>();
  const [vaultId, setVaultId] = React.useState('');
  const [dustValue, setDustValue] = React.useState('0');
  const [vaultMaxAmount, setVaultMaxAmount] = React.useState('');

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!btcAmount) return;
    if (!btcToDotRate) return;
    if (!depositRate) return;
    if (!feeRate) return;
    if (!vaults) return;

    const bigPolkaBTCAmount = new Big(btcAmount);
    const theBridgeFee = bigPolkaBTCAmount.mul(feeRate);
    setBridgeFee(theBridgeFee);

    const theSecurityDeposit = bigPolkaBTCAmount.mul(btcToDotRate).mul(depositRate);
    setSecurityDeposit(theSecurityDeposit);

    const vaultId = getRandomVaultIdWithCapacity(Array.from(vaults || new Map()), bigPolkaBTCAmount);
    setVaultId(vaultId ?? '');

    const thePolkaBtcAmount = new Big(btcAmount).sub(theBridgeFee);
    setPolkaBtcAmount(thePolkaBtcAmount);
  }, [
    btcAmount,
    btcToDotRate,
    depositRate,
    feeRate,
    vaults
  ]);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

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
        setBtcToDotRate(btcToDot);

        let theVaultMaxAmount = new Big(0);
        // The first item is the vault with the largest capacity
        theVaultMaxAmount = theVaults.values().next().value;

        setVaultMaxAmount(theVaultMaxAmount.toString());
        setVaults(theVaults);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        setError(error);
      }
    })();
  }, [
    polkaBtcLoaded,
    dispatch
  ]);

  if (status === STATUSES.REJECTED && error) {
    return (
      <ErrorHandler error={error} />
    );
  }

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayRose-400' />
      </div>
    );
  }

  const validateBTCAmount = (value: number): string | undefined => {
    if (value > 1) {
      return t('issue_page.validation_max_value');
      // TODO: should be `big` type other than `Number`
    } else if (value < Number(dustValue)) {
      return `${t('issue_page.validation_min_value')}${dustValue} BTC).`;
    }

    // ray test touch <
    // TODO: error-prone
    if (!vaultId) {
      return t('issue_page.maximum_in_single_request', {
        maxAmount: parseFloat(Number(vaultMaxAmount).toFixed(5))
      });
    }
    // ray test touch >

    if (bitcoinHeight - btcRelayHeight > BLOCKS_BEHIND_LIMIT) {
      return t('issue_page.error_more_than_6_blocks_behind');
    }

    if (!polkaBtcLoaded) {
      return 'PolkaBTC must be loaded!';
    }

    if (btcToSat(value.toString()) === undefined) {
      return 'Invalid BTC amount input!';
    }

    return undefined;
  };

  const onSubmit = async (data: IssueForm) => {
    try {
      const polkaBTCAmount = new Big(data[BTC_AMOUNT]);
      const vaultAccountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vaultId);
      setSubmitStatus(STATUSES.PENDING);
      const result = await window.polkaBTC.issue.request(polkaBTCAmount, vaultAccountId);
      // ray test touch <
      const issueRequest = await parachainToUIIssueRequest(result.id, result.issueRequest);
      // ray test touch >
      setSubmitStatus(STATUSES.RESOLVED);

      // Get the issue ID from the request issue event
      const issueId = stripHexPrefix(result.id.toString());
      dispatch(changeIssueIdAction(issueId));

      // Update the issue status
      dispatch(addIssueRequestAction(issueRequest));
      dispatch(changeIssueStepAction('BTC_PAYMENT'));
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  if (status === STATUSES.RESOLVED) {
    return (
      <>
        <form
          className='space-y-8'
          onSubmit={handleSubmit(onSubmit)}>
          <h4
            className={clsx(
              'font-medium',
              'text-center',
              'text-interlayRose'
            )}>
            {t('issue_page.mint_polka_by_wrapping')}
          </h4>
          <PolkaBTCField
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
              <PolkaBTCLogoIcon
                width={23}
                height={23} />
            }
            value={displayBtcAmount(polkaBtcAmount || '0')}
            unitName='PolkaBTC'
            approxUSD={getUsdAmount(polkaBtcAmount || '0', prices.bitcoin.usd)} />
          <InterlayButton
            type='submit'
            style={{ display: 'flex' }}
            className='mx-auto'
            variant='contained'
            color='primary'
            disabled={
              // TODO: `parachainStatus` and `address` should be checked at upper levels
              parachainStatus !== ParachainStatus.Running ||
              !address
            }
            pending={submitStatus === STATUSES.PENDING}>
            {t('confirm')}
          </InterlayButton>
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
  }

  return null;
};

export default EnterBTCAmount;
