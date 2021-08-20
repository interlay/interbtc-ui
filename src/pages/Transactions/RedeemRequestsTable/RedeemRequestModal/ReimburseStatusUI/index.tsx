import * as React from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import {
  useMutation,
  useQueryClient
} from 'react-query';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';
import { Redeem } from '@interlay/interbtc';
import {
  BTCAmount,
  Polkadot,
  PolkadotAmount
} from '@interlay/monetary-js';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import ErrorFallback from 'components/ErrorFallback';
import useQueryParams from 'utils/hooks/use-query-params';
import { getUsdAmount } from 'common/utils/utils';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import { USER_REDEEM_REQUESTS_FETCHER } from 'services/user-redeem-requests-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  request: Redeem;
  onClose: () => void;
}

const ReimburseStatusUI = ({
  request,
  onClose
}: Props): JSX.Element => {
  const {
    address,
    polkaBtcLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const [punishmentDOT, setPunishmentDOT] = React.useState(PolkadotAmount.zero);
  const [dotAmount, setDOTAmount] = React.useState(PolkadotAmount.zero);
  const { t } = useTranslation();
  const handleError = useErrorHandler();

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!request) return;
    if (!handleError) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [
          punishment,
          btcDotRate
        ] = await Promise.all([
          window.polkaBTC.vaults.getPunishmentFee(),
          window.polkaBTC.oracle.getExchangeRate(Polkadot)
        ]);
        const amountPolkaBTC = request ? request.amountBTC : BTCAmount.zero;
        setDOTAmount(btcDotRate.toCounter(amountPolkaBTC));
        setPunishmentDOT(btcDotRate.toCounter(amountPolkaBTC).mul(new Big(punishment)));
      } catch (error) {
        handleError(error);
      }
    })();
  }, [
    request,
    polkaBtcLoaded,
    handleError
  ]);

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;

  const queryClient = useQueryClient();
  const retryMutation = useMutation<void, Error, Redeem>(
    (variables: Redeem) => {
      return window.polkaBTC.redeem.cancel(variables.id, false);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          USER_REDEEM_REQUESTS_FETCHER,
          address,
          selectedPageIndex,
          TABLE_PAGE_LIMIT
        ]);
        toast.success(t('redeem_page.successfully_cancelled_redeem'));
        onClose();
      },
      onError: error => {
        // TODO: should add error handling UX
        console.log('[useMutation] error => ', error);
      }
    }
  );
  const reimburseMutation = useMutation<void, Error, Redeem>(
    (variables: Redeem) => {
      return window.polkaBTC.redeem.cancel(variables.id, true);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          USER_REDEEM_REQUESTS_FETCHER,
          address,
          selectedPageIndex,
          TABLE_PAGE_LIMIT
        ]);
        toast.success(t('redeem_page.successfully_cancelled_redeem'));
        onClose();
      },
      onError: error => {
        // TODO: should add error handling UX
        console.log('[useMutation] error => ', error);
      }
    }
  );

  const handleRetry = () => {
    if (!polkaBtcLoaded) {
      throw new Error('interBTC is not loaded!');
    }

    retryMutation.mutate(request);
  };

  const handleReimburse = () => {
    if (!polkaBtcLoaded) {
      throw new Error('interBTC is not loaded!');
    }

    reimburseMutation.mutate(request);
  };

  return (
    <RequestWrapper
      id='ReimburseStatusUI'
      className='lg:px-12'>
      <div className='space-y-1'>
        <h2
          className={clsx(
            'text-lg',
            'font-medium',
            'text-interlayCalifornia',
            'flex',
            'justify-center',
            'items-center',
            'space-x-1'
          )}>
          <FaExclamationCircle />
          <span>
            {t('redeem_page.sorry_redeem_failed')}
          </span>
        </h2>
        <p
          className={clsx(
            'text-textSecondary',
            'text-justify'
          )}>
          <span>{t('redeem_page.vault_did_not_send')}</span>
          <span className='text-interlayDenim'>
            &nbsp;{punishmentDOT.toHuman()} DOT
          </span>
          <span>&nbsp;{`(≈ $ ${getUsdAmount(punishmentDOT, prices.polkadot.usd)})`}</span>
          <span>&nbsp;{t('redeem_page.compensation')}</span>
          .
        </p>
      </div>
      <div className='space-y-2'>
        <h5 className='font-medium'>
          {t('redeem_page.to_redeem_interbtc')}
        </h5>
        <ul
          className={clsx(
            'space-y-3',
            'ml-6',
            'text-textSecondary'
          )}>
          <li className='list-decimal'>
            <p className='text-justify'>
              <span>{t('redeem_page.receive_compensation')}</span>
              <span className='text-interlayDenim'>&nbsp;{punishmentDOT.toHuman()} DOT</span>
              <span>
                &nbsp;
                {t('redeem_page.retry_with_another', {
                  compensationPrice: getUsdAmount(punishmentDOT, prices.polkadot.usd)
                })}
              </span>
              .
            </p>
            <InterlayConiferOutlinedButton
              className='w-full'
              disabled={reimburseMutation.isLoading}
              pending={retryMutation.isLoading}
              onClick={handleRetry}>
              {t('retry')}
            </InterlayConiferOutlinedButton>
          </li>
          <li className='list-decimal'>
            <p className='text-justify'>
              <span>{t('redeem_page.burn_interbtc')}</span>
              <span className='text-interlayDenim'>&nbsp;{dotAmount.toHuman()} DOT</span>
              <span>
                &nbsp;
                {t('redeem_page.with_added', {
                  amountPrice: getUsdAmount(dotAmount, prices.polkadot.usd)
                })}
              </span>
              <span className='text-interlayDenim'>&nbsp;{punishmentDOT.toHuman()} DOT</span>
              <span>
                &nbsp;
                {t('redeem_page.as_compensation_instead', {
                  compensationPrice: getUsdAmount(punishmentDOT, prices.polkadot.usd)
                })}
              </span>
            </p>
            <InterlayDenimOutlinedButton
              className='w-full'
              disabled={retryMutation.isLoading}
              pending={reimburseMutation.isLoading}
              onClick={handleReimburse}>
              {t('redeem_page.reimburse')}
            </InterlayDenimOutlinedButton>
          </li>
        </ul>
      </div>
    </RequestWrapper>
  );
};

export default withErrorBoundary(ReimburseStatusUI, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
