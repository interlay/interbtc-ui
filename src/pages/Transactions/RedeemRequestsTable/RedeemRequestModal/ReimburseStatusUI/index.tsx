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
import {
  Redeem,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import ErrorFallback from 'components/ErrorFallback';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import useQueryParams from 'utils/hooks/use-query-params';
import {
  getUsdAmount,
  displayMonetaryAmount
} from 'common/utils/utils';
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
    bridgeLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const [
    punishmentCollateralTokenAmount,
    setPunishmentCollateralTokenAmount
  ] = React.useState(newMonetaryAmount(0, COLLATERAL_TOKEN));
  const [
    collateralTokenAmount,
    setCollateralTokenAmount
  ] = React.useState(newMonetaryAmount(0, COLLATERAL_TOKEN));
  const { t } = useTranslation();
  const handleError = useErrorHandler();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!request) return;
    if (!handleError) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [
          punishment,
          btcDotRate
        ] = await Promise.all([
          window.bridge.interBtcApi.vaults.getPunishmentFee(),
          window.bridge.interBtcApi.oracle.getExchangeRate(COLLATERAL_TOKEN)
        ]);
        const wrappedTokenAmount = request ? request.amountBTC : BitcoinAmount.zero;
        setCollateralTokenAmount(btcDotRate.toCounter(wrappedTokenAmount));
        setPunishmentCollateralTokenAmount(btcDotRate.toCounter(wrappedTokenAmount).mul(new Big(punishment)));
      } catch (error) {
        handleError(error);
      }
    })();
  }, [
    request,
    bridgeLoaded,
    handleError
  ]);

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;

  const queryClient = useQueryClient();
  const retryMutation = useMutation<void, Error, Redeem>(
    (variables: Redeem) => {
      return window.bridge.interBtcApi.redeem.cancel(variables.id, false);
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
      return window.bridge.interBtcApi.redeem.cancel(variables.id, true);
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
    if (!bridgeLoaded) {
      throw new Error('interBTC is not loaded!');
    }

    retryMutation.mutate(request);
  };

  const handleReimburse = () => {
    if (!bridgeLoaded) {
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
            &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} DOT
          </span>
          <span>&nbsp;{`(≈ $ ${getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken.usd)})`}</span>
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
              <span className='text-interlayDenim'>
                &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} DOT
              </span>
              <span>
                &nbsp;
                {t('redeem_page.retry_with_another', {
                  compensationPrice: getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken.usd)
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
              <span className='text-interlayDenim'>
                &nbsp;{displayMonetaryAmount(collateralTokenAmount)} DOT
              </span>
              <span>
                &nbsp;
                {t('redeem_page.with_added', {
                  amountPrice: getUsdAmount(collateralTokenAmount, prices.collateralToken.usd)
                })}
              </span>
              <span className='text-interlayDenim'>
                &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} DOT
              </span>
              <span>
                &nbsp;
                {t('redeem_page.as_compensation_instead', {
                  compensationPrice: getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken.usd)
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
