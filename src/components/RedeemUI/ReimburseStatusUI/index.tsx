import * as React from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';
import { newMonetaryAmount } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import InterlayDenimOrKintsugiMidnightOutlinedButton from 'components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import ErrorFallback from 'components/ErrorFallback';
import PrimaryColorSpan from 'components/PrimaryColorSpan';
import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN_SYMBOL, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL } from 'config/relay-chains';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { getUsdAmount, displayMonetaryAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { REDEEMS_FETCHER } from 'services/fetchers/redeems-fetcher';
import { getColorShade } from 'utils/helpers/colors';
import { useGetPrices } from 'utils/hooks/api/use-get-prices';
import { getTokenPrice } from 'utils/helpers/prices';

interface Props {
  redeem: any; // TODO: should type properly (`Relay`)
  onClose: () => void;
}

const ReimburseStatusUI = ({ redeem, onClose }: Props): JSX.Element => {
  const prices = useGetPrices();

  const { bridgeLoaded, address } = useSelector((state: StoreType) => state.general);
  const [punishmentCollateralTokenAmount, setPunishmentCollateralTokenAmount] = React.useState(
    newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
  );
  const [collateralTokenAmount, setCollateralTokenAmount] = React.useState(
    newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
  );
  const { t } = useTranslation();
  const handleError = useErrorHandler();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!redeem) return;
    if (!handleError) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [punishment, btcDotRate] = await Promise.all([
          window.bridge.vaults.getPunishmentFee(),
          window.bridge.oracle.getExchangeRate(RELAY_CHAIN_NATIVE_TOKEN)
        ]);
        const wrappedTokenAmount = redeem.request.requestedAmountBacking;
        setCollateralTokenAmount(btcDotRate.toCounter(wrappedTokenAmount));
        setPunishmentCollateralTokenAmount(btcDotRate.toCounter(wrappedTokenAmount).mul(new Big(punishment)));
      } catch (error) {
        handleError(error);
      }
    })();
  }, [redeem, bridgeLoaded, handleError]);

  const queryClient = useQueryClient();
  // TODO: should type properly (`Relay`)
  const retryMutation = useMutation<void, Error, any>(
    (variables: any) => {
      return window.bridge.redeem.cancel(variables.id, false);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([REDEEMS_FETCHER]);
        toast.success(t('redeem_page.successfully_cancelled_redeem'));
        onClose();
      },
      onError: (error) => {
        console.log('[useMutation] error => ', error);
        toast.error(t('redeem_page.error_cancelling_redeem'));
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
        queryClient.invalidateQueries([REDEEMS_FETCHER]);
        toast.success(t('redeem_page.successfully_cancelled_redeem'));
        onClose();
      },
      onError: (error) => {
        console.log('[useMutation] error => ', error);
        toast.error(t('redeem_page.error_cancelling_redeem'));
      }
    }
  );

  const handleRetry = () => {
    if (!bridgeLoaded) {
      throw new Error('Bridge is not loaded!');
    }

    retryMutation.mutate(redeem);
  };

  const handleReimburse = () => {
    if (!bridgeLoaded) {
      throw new Error('Bridge is not loaded!');
    }

    reimburseMutation.mutate(redeem);
  };

  const isOwner = address === redeem.userParachainAddress;

  return (
    <RequestWrapper className='lg:px-12'>
      <div className='space-y-1'>
        <h2
          className={clsx(
            'text-lg',
            'font-medium',
            getColorShade('yellow'),
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
            &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} {RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
          </PrimaryColorSpan>
          <span>
            &nbsp;
            {`(≈ $ ${getUsdAmount(
              punishmentCollateralTokenAmount,
              getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd
            )})`}
          </span>
          <span>
            &nbsp;
            {t('redeem_page.compensation', {
              collateralTokenSymbol: RELAY_CHAIN_NATIVE_TOKEN_SYMBOL
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
                &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} {RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
              </PrimaryColorSpan>
              <span>
                &nbsp;
                {t('redeem_page.retry_with_another', {
                  compensationPrice: getUsdAmount(
                    punishmentCollateralTokenAmount,
                    getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd
                  )
                })}
              </span>
              .
            </p>
            <InterlayConiferOutlinedButton
              className='w-full'
              disabled={reimburseMutation.isLoading || !isOwner}
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
                &nbsp;{displayMonetaryAmount(collateralTokenAmount)} {RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
              </PrimaryColorSpan>
              <span>
                &nbsp;
                {t('redeem_page.with_added', {
                  amountPrice: getUsdAmount(
                    collateralTokenAmount,
                    getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd
                  )
                })}
              </span>
              <PrimaryColorSpan>
                &nbsp;{displayMonetaryAmount(punishmentCollateralTokenAmount)} {RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
              </PrimaryColorSpan>
              <span>
                &nbsp;
                {t('redeem_page.as_compensation_instead', {
                  compensationPrice: getUsdAmount(
                    punishmentCollateralTokenAmount,
                    getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd
                  )
                })}
              </span>
            </p>
            <InterlayDenimOrKintsugiMidnightOutlinedButton
              className='w-full'
              disabled={retryMutation.isLoading || !isOwner}
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
