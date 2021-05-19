
import * as React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import BN from 'bn.js';
import Big from 'big.js';
import clsx from 'clsx';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { PolkaBTC } from '@interlay/polkabtc/build/interfaces/default';
import { AccountId } from '@polkadot/types/interfaces';
import {
  btcToSat,
  satToBTC,
  stripHexPrefix
} from '@interlay/polkabtc';

import PolkaBTCField from '../PolkaBTCField';
import PriceInfo from '../PriceInfo';
import ParachainStatusInfo from '../ParachainStatusInfo';
import Tooltip from 'components/Tooltip';
import EllipsisLoader from 'components/EllipsisLoader';
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
  getRandomVaultIdWithCapacity,
  getUsdAmount
} from 'common/utils/utils';
import { parachainToUIIssueRequest } from 'common/utils/requests';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

const POLKA_BTC_AMOUNT = 'polka-btc-amount';

type IssueForm = {
  [POLKA_BTC_AMOUNT]: string;
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
  const polkaBTCAmount = watch(POLKA_BTC_AMOUNT);

  // Additional info: bridge fee, security deposit, amount BTC
  // Current fee model specification taken from: https://interlay.gitlab.io/polkabtc-spec/spec/fee.html
  const [feeRate, setFeeRate] = React.useState(new Big(0.005)); // Set default to 0.5%
  const [depositRate, setDepositRate] = React.useState(new Big(0.00005)); // Set default to 0.005%
  const [btcToDotRate, setBtcToDotRate] = React.useState(new Big(0));
  // TODO: could use number as it's more natural
  const [bridgeFee, setBridgeFee] = React.useState('0');
  const [securityDeposit, setSecurityDeposit] = React.useState('0');
  const [vaults, setVaults] = React.useState<Map<AccountId, PolkaBTC>>();
  const [vaultId, setVaultId] = React.useState('');
  const [dustValue, setDustValue] = React.useState('0');
  const [vaultMaxAmount, setVaultMaxAmount] = React.useState('');

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!polkaBTCAmount) return;
    if (!btcToDotRate) return;
    if (!depositRate) return;
    if (!feeRate) return;
    if (!vaults) return;

    const bigPolkaBTCAmount = new Big(polkaBTCAmount);
    const theBridgeFee = bigPolkaBTCAmount.mul(feeRate);
    setBridgeFee(theBridgeFee.toString());

    const theSecurityDeposit = bigPolkaBTCAmount.mul(btcToDotRate).mul(depositRate);
    setSecurityDeposit(theSecurityDeposit.round(8).toString());

    const polkaBTCAmountInSatoshi = btcToSat(polkaBTCAmount);
    const vaultId = getRandomVaultIdWithCapacity(Array.from(vaults || new Map()), new BN(polkaBTCAmountInSatoshi));
    setVaultId(vaultId ?? '');
  }, [
    polkaBTCAmount,
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
          dustValueAsSatoshi,
          btcToDot,
          theVaults
        ] = await Promise.all([
          // Loading this data is not strictly required as long as the constantly set values did
          // not change. However, you will not see the correct value for the security deposit.
          // But not having this data will NOT block the requestIssue
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
        const issuePeriod = new BN(issuePeriodInBlocks.toString()).mul(new BN(BLOCK_TIME)).toNumber();
        dispatch(updateIssuePeriodAction(issuePeriod));
        const theDustValue = satToBTC(dustValueAsSatoshi.toString());
        setDustValue(theDustValue);
        setBtcToDotRate(btcToDot);

        // ray test touch <
        let theVaultMaxAmount = new BN(0);
        // TODO: double-check
        // The first item is the vault with the largest capacity
        for (const issuableTokens of theVaults.values()) {
          theVaultMaxAmount = issuableTokens.toBn();
          break;
        }
        // ray test touch >
        setVaultMaxAmount(satToBTC(theVaultMaxAmount.toString()));
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
  if (submitStatus === STATUSES.REJECTED && submitError) {
    return (
      <ErrorHandler error={submitError} />
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

  const validatePolkaBTCAmount = (value: number): string | undefined => {
    if (value > 1) {
      return t('issue_page.validation_max_value');
      // TODO: should be `big` type other than `Number`
    } else if (value < Number(dustValue)) {
      return `${t('issue_page.validation_min_value')}${dustValue}BTC).`;
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

    const amountInSatoshi = btcToSat(value.toString());
    if (amountInSatoshi === undefined) {
      return 'Invalid BTC amount input!';
    }

    return undefined;
  };

  const onSubmit = async (data: IssueForm) => {
    try {
      const polkaBTCAmountInSatoshi = btcToSat(data[POLKA_BTC_AMOUNT]);
      // TODO: `Balance` is hardcoded
      const amountInSatoshi = window.polkaBTC.api.createType('Balance', polkaBTCAmountInSatoshi);
      const vaultAccountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vaultId);
      setSubmitStatus(STATUSES.PENDING);
      const result = await window.polkaBTC.issue.request(amountInSatoshi as PolkaBTC, vaultAccountId);
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
          id='polka-btc-amount'
          name={POLKA_BTC_AMOUNT}
          type='number'
          label='PolkaBTC'
          step='any'
          placeholder='0.00'
          min={0}
          ref={register({
            required: {
              value: true,
              message: t('issue_page.enter_valid_amount')
            },
            validate: value => validatePolkaBTCAmount(value)
          })}
          usdText={`≈ $ ${getUsdAmount(polkaBTCAmount || '0', prices.bitcoin.usd)}`}
          error={!!errors[POLKA_BTC_AMOUNT]}
          required
          helperText={errors[POLKA_BTC_AMOUNT]?.message} />
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
            <Tooltip overlay='Bridge Fee'>
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
          value={securityDeposit}
          unitName='DOT'
          approxUSD={getUsdAmount(securityDeposit, prices.polkadot.usd)}
          tooltip={
            <Tooltip overlay='Security Deposit'>
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
              {t('total_deposit')}
            </h5>
          }
          unitIcon={
            <BitcoinLogoIcon
              width={23}
              height={23} />
          }
          value={displayBtcAmount(polkaBTCAmount || '0')}
          unitName='BTC'
          approxUSD={getUsdAmount(polkaBTCAmount || '0', prices.bitcoin.usd)} />
        <InterlayButton
          type='submit'
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
    );
  }

  return null;
};

export default EnterBTCAmount;
