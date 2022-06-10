import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount,getUsdAmount } from '@/common/utils/utils';
import InterlayConiferOutlinedButton from '@/components/buttons/InterlayConiferOutlinedButton';
import InterlayDenimOrKintsugiMidnightOutlinedButton from '@/components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorSpan from '@/components/PrimaryColorSpan';
import { COLLATERAL_TOKEN, COLLATERAL_TOKEN_SYMBOL,WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import RequestWrapper from '@/pages/Bridge/RequestWrapper';
import { REDEEM_FETCHER } from '@/services/fetchers/redeem-request-fetcher';
import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
  onClose: () => void;
}

const ReimburseStatusUI = ({ request, onClose }: Props): JSX.Element => {
  const { bridgeLoaded, prices } = useSelector((state: StoreType) => state.general);
  const [punishmentCollateralTokenAmount, setPunishmentCollateralTokenAmount] = React.useState(
    newMonetaryAmount(0, COLLATERAL_TOKEN)
  );
  const [collateralTokenAmount, setCollateralTokenAmount] = React.useState(newMonetaryAmount(0, COLLATERAL_TOKEN));
  const { t } = useTranslation();
  const handleError = useErrorHandler();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!request) return;
    if (!handleError) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [punishment, btcDotRate] = await Promise.all([
          window.bridge.vaults.getPunishmentFee(),
          window.bridge.oracle.getExchangeRate(COLLATERAL_TOKEN)
        ]);
        const wrappedTokenAmount = request ? request.request.requestedAmountBacking : BitcoinAmount.zero;
        setCollateralTokenAmount(btcDotRate.toCounter(wrappedTokenAmount));
        setPunishmentCollateralTokenAmount(btcDotRate.toCounter(wrappedTokenAmount).mul(new Big(punishment)));
      } catch (error) {
        handleError(error);
      }
    })();
  }, [request, bridgeLoaded, handleError]);

  const queryClient = useQueryClient();
  // TODO: should type properly (`Relay`)
  const retryMutation = useMutation<void, Error, any>(
    (variables: any) => {
      return window.bridge.redeem.cancel(variables.id, false);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([REDEEM_FETCHER]);
        toast.success(t('redeem_page.successfully_cancelled_redeem'));
        onClose();
      },
      onError: (error) => {
        // TODO: should add error handling UX
        console.log('[useMutation] error => ', error);
      }
    }
  );
  // TODO: should type properly (`Relay`)
  const reimburseMutation = useMutation<void, Error, any>(
    (variables: any) => {
      return window.bridge.redeem.cancel(variables.id, true);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([REDEEM_FETCHER]);
        toast.success(t('redeem_page.successfully_cancelled_redeem'));
        onClose();
      },
      onError: (error) => {
        // TODO: should add error handling UX
        console.log('[useMutation] error => ', error);
      }
    }
  );

  const handleRetry = () => {
    if (!bridgeLoaded) {
      throw new Error('Bridge is not loaded!');
    }

    retryMutation.mutate(request);
  };

  const handleReimburse = () => {
    if (!bridgeLoaded) {
      throw new Error('Bridge is not loaded!');
    }

    reimburseMutation.mutate(request);
  };

  return (
    <RequestWrapper className='lg:px-12'>
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
          )}
        >
          <FaExclamationCircle />
          <span>{t('redeem_page.sorry_redeem_failed')}</span>
        </h2>
        <p
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'text-justify'
          )}
        >
          <span>{t('redeem_page.vault_did_not_send')}</span>
          <PrimaryColorSpan>
            &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} {COLLATERAL_TOKEN_SYMBOL}
          </PrimaryColorSpan>
          <span>&nbsp;{`(≈ $ ${getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken?.usd)})`}</span>
          <span>
            &nbsp;
            {t('redeem_page.compensation', {
              collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
            })}
          </span>
          .
        </p>
      </div>
      <div className='space-y-2'>
        <h5 className='font-medium'>
          {t('redeem_page.to_redeem_interbtc', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </h5>
        <ul
          className={clsx(
            'space-y-3',
            'ml-6',
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          <li className='list-decimal'>
            <p className='text-justify'>
              <span>{t('redeem_page.receive_compensation')}</span>
              <PrimaryColorSpan>
                &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} {COLLATERAL_TOKEN_SYMBOL}
              </PrimaryColorSpan>
              <span>
                &nbsp;
                {t('redeem_page.retry_with_another', {
                  compensationPrice: getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken?.usd)
                })}
              </span>
              .
            </p>
            <InterlayConiferOutlinedButton
              className='w-full'
              disabled={reimburseMutation.isLoading}
              pending={retryMutation.isLoading}
              onClick={handleRetry}
            >
              {t('retry')}
            </InterlayConiferOutlinedButton>
          </li>
          <li className='list-decimal'>
            <p className='text-justify'>
              <span>
                {t('redeem_page.burn_interbtc', {
                  wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
                })}
              </span>
              <PrimaryColorSpan>
                &nbsp;{displayMonetaryAmount(collateralTokenAmount)} {COLLATERAL_TOKEN_SYMBOL}
              </PrimaryColorSpan>
              <span>
                &nbsp;
                {t('redeem_page.with_added', {
                  amountPrice: getUsdAmount(collateralTokenAmount, prices.collateralToken?.usd)
                })}
              </span>
              <PrimaryColorSpan>
                &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} {COLLATERAL_TOKEN_SYMBOL}
              </PrimaryColorSpan>
              <span>
                &nbsp;
                {t('redeem_page.as_compensation_instead', {
                  compensationPrice: getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken?.usd)
                })}
              </span>
            </p>
            <InterlayDenimOrKintsugiMidnightOutlinedButton
              className='w-full'
              disabled={retryMutation.isLoading}
              pending={reimburseMutation.isLoading}
              onClick={handleReimburse}
            >
              {t('redeem_page.reimburse')}
            </InterlayDenimOrKintsugiMidnightOutlinedButton>
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
