
import {
  useState,
  useEffect
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import BN from 'bn.js';
import { PolkaBTC } from '@interlay/polkabtc/build/interfaces/default';
import clsx from 'clsx';

import ButtonMaybePending from 'common/components/pending-button';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import * as constants from '../../../constants';
import {
  changeIssueStepAction,
  changeIssueIdAction,
  addIssueRequestAction,
  updateIssuePeriodAction
} from 'common/actions/issue.actions';
import {
  btcToSat,
  satToBTC,
  planckToDOT,
  stripHexPrefix
} from '@interlay/polkabtc';
import {
  displayBtcAmount,
  getRandomVaultIdWithCapacity,
  getUsdAmount,
  parachainToUIIssueRequest
} from 'common/utils/utils';
import bitcoinLogo from 'assets/img/small-bitcoin-logo.png';
import polkadotLogo from 'assets/img/small-polkadot-logo.png';
import { ACCOUNT_ID_TYPE_NAME } from '../../../constants';
import ParachainStatusInfo from 'components/ParachainStatusInfo';

type EnterBTCForm = {
  amountBTC: string;
}

function EnterBTCAmount() {
  const {
    polkaBtcLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    parachainStatus
  } = useSelector((state: StoreType) => state.general);
  const [amountBTC, setAmountBTC] = useState('');
  const defaultValues = amountBTC ? { defaultValues: { amountBTC: amountBTC } } : undefined;
  const {
    register,
    handleSubmit,
    errors,
    getValues
  } = useForm<EnterBTCForm>(defaultValues);
  const [isRequestPending, setRequestPending] = useState(false);
  const [dustValue, setDustValue] = useState('0');
  const [usdAmount, setUsdAmount] = useState('');
  const [vaultMaxAmount, setVaultMaxAmount] = useState('');
  const [fee, setFee] = useState('0');
  const [deposit, setDeposit] = useState('0');
  const [vaults, setVaults] = useState(new Map());
  const [vaultId, setVaultId] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded) return;

      try {
        // set issue period
        const issuePeriodInBlocks = await window.polkaBTC.issue.getIssuePeriod();
        const issuePeriod = new BN(issuePeriodInBlocks.toString()).mul(new BN(constants.BLOCK_TIME)).toNumber();
        dispatch(updateIssuePeriodAction(issuePeriod));
      } catch (error) {
        console.log('[EnterBtcAmount] error.message => ', error.message);
      }
    };
    fetchData();
  }, [
    polkaBtcLoaded,
    dispatch
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded) return;

      try {
        const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
        const dustValueBtc = satToBTC(dustValueAsSatoshi.toString());
        const vaultsMap = await window.polkaBTC.vaults.getVaultsWithIssuableTokens();
        let maxVaultAmount = new BN(0);
        for (const issuableTokens of vaultsMap.values()) {
          maxVaultAmount = issuableTokens.toBn();
          break;
        }
        setVaultMaxAmount(satToBTC(maxVaultAmount.toString()));
        setVaults(vaultsMap);
        setDustValue(dustValueBtc);
      } catch (error) {
        console.log('[EnterBtcAmount] error.message => ', error.message);
      }
    };
    setUsdAmount(getUsdAmount(amountBTC || getValues('amountBTC') || '0', prices.bitcoin.usd));
    fetchData();
  }, [
    polkaBtcLoaded,
    setUsdAmount,
    amountBTC,
    prices.bitcoin.usd,
    getValues
  ]);

  const onSubmit = handleSubmit(async ({ amountBTC }) => {
    if (!polkaBtcLoaded || !vaultId) return;

    if (!address) {
      toast.warning(t('issue_page.must_select_account_warning'));
      return;
    }

    if (bitcoinHeight - btcRelayHeight > constants.BLOCKS_BEHIND_LIMIT) {
      toast.error(t('issue_page.error_more_than_6_blocks_behind'));
      return;
    }

    setRequestPending(true);
    try {
      const amountSAT = btcToSat(amountBTC);
      if (amountSAT === undefined) {
        throw new Error('Invalid BTC amount input.');
      }

      const amountAsSatoshi = window.polkaBTC.api.createType('Balance', amountSAT);

      const vaultAccountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vaultId);
      const requestResult = await window.polkaBTC.issue.request(amountAsSatoshi as PolkaBTC, vaultAccountId);

      const vaultBTCAddress = requestResult.issueRequest.btc_address;
      if (vaultBTCAddress === undefined) {
        throw new Error('Could not generate unique vault address.');
      }
      // get the issue id from the request issue event
      const id = stripHexPrefix(requestResult.id.toString());
      dispatch(changeIssueIdAction(id));

      const issueRequest = await parachainToUIIssueRequest(requestResult.id, requestResult.issueRequest);

      // update the issue status
      dispatch(addIssueRequestAction(issueRequest));
      dispatch(changeIssueStepAction('BTC_PAYMENT'));
    } catch (error) {
      toast.error(error.toString());
    }
    setRequestPending(false);
  });

  const onValueChange = async () => {
    const value = getValues('amountBTC');
    setAmountBTC(value);
    setUsdAmount(getUsdAmount(value || '0', prices.bitcoin.usd));
    try {
      const fee = await window.polkaBTC.issue.getFeesToPay(value);
      setFee(fee);

      const amountSAT = btcToSat(value);
      const vaultId = getRandomVaultIdWithCapacity(Array.from(vaults), new BN(amountSAT));
      if (vaultId) {
        const vaultAccountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vaultId);
        setVaultId(vaultAccountId.toString());
      } else {
        setVaultId('');
      }

      const amountSatTyped = window.polkaBTC.api.createType('Balance', amountSAT) as PolkaBTC;
      const griefingCollateral = await window.polkaBTC.issue.getGriefingCollateralInPlanck(amountSatTyped);
      setDeposit(planckToDOT(griefingCollateral.toString()));
    } catch (error) {
      console.log(error);
    }
  };

  const validateAmount = (value: number): string | undefined => {
    if (!vaultId) {
      return t('issue_page.maximum_in_single_request', {
        maxAmount: parseFloat(Number(vaultMaxAmount).toFixed(5))
      });
    }
    if (value > 1) {
      return t('issue_page.validation_max_value');
    }
    if (value < Number(dustValue)) {
      return t('issue_page.validation_min_value') + dustValue + 'BTC).';
    }

    return undefined;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='row'>
        <div
          className={clsx(
            'col-12 wizard-header-text',
            'text-interlayPink'
          )}>
          {t('issue_page.mint_polka_by_wrapping')}
        </div>
      </div>
      <div className='row'>
        <div className='col-6'>
          <input
            id='amount-btc-input'
            name='amountBTC'
            type='number'
            step='any'
            placeholder='0.00'
            className={'' + (errors.amountBTC ? ' error-borders' : '')}
            onChange={onValueChange}
            ref={register({
              required: true,
              validate: value => {
                return validateAmount(value);
              }
            })} />
        </div>
        <div className='col-6 mark-currency'>PolkaBTC</div>
      </div>
      <div className='row usd-price'>
        <div className='col'>{'~ $' + usdAmount}</div>
      </div>
      {errors.amountBTC && (
        <div className='wizard-input-error'>
          {errors.amountBTC.type === 'required' ? t('issue_page.enter_valid_amount') : errors.amountBTC.message}
        </div>
      )}
      <ParachainStatusInfo status={parachainStatus} />
      <div className='row justify-content-center'>
        <div className='col-10'>
          <div className='wizard-item wizard-item-remove-border'>
            <div className='row'>
              <div className='col-6 text-left'>{t('bridge_fee')}</div>
              <div className='col fee-number'>
                <div>
                  <img
                    src={bitcoinLogo}
                    width='23px'
                    height='23px'
                    alt='bitcoin logo'>
                  </img> &nbsp;
                  <span className='fee-btc'>{displayBtcAmount(fee)}</span> BTC
                </div>
                <div>{'~ $' + getUsdAmount(fee, prices.bitcoin.usd)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-10'>
          <div className='wizard-item wizard-item-remove-border'>
            <div className='row'>
              <div className='col-6 text-left'>{t('issue_page.security_deposit')}</div>
              <div className='col fee-number'>
                <div>
                  <img
                    src={polkadotLogo}
                    width='20px'
                    height='20px'
                    style={{ marginRight: '5px' }}
                    alt='polkadot logo'>
                  </img>
                  <span className='fee-btc'>{parseFloat(Number(deposit).toFixed(5))}</span> DOT
                </div>
                <div>{'~ $' + getUsdAmount(deposit, prices.polkadot.usd)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-10 horizontal-line-total'></div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-10'>
          <div className='wizard-item wizard-item-remove-border '>
            <div className='row justify-content-center'>
              <div className='col-6 text-left total-added-value'>{t('total_deposit')}</div>
              <div className='col fee-number'>
                <div>
                  <img
                    src={bitcoinLogo}
                    width='23px'
                    height='23px'
                    alt='bitcoin logo'>
                  </img>
                  &nbsp;&nbsp;
                  <span className='fee-btc'>
                    {displayBtcAmount(Number(getValues('amountBTC') || '0') + Number(fee))}
                  </span>{' '}
                  BTC
                </div>
                <div>
                  {'~ $' +
                    getUsdAmount((Number(getValues('amountBTC') || '0') + Number(fee)).toString(), prices.bitcoin.usd)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ButtonMaybePending
        className='btn green-button app-btn'
        disabled={parachainStatus !== ParachainStatus.Running}
        isPending={isRequestPending}
        onClick={onSubmit}>
        {t('confirm')}
      </ButtonMaybePending>
    </form>
  );
}

export default EnterBTCAmount;
