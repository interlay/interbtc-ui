import { newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, getPolkadotLink, getUsdAmount } from '@/common/utils/utils';
import ExternalLink from '@/components/ExternalLink';
import Hr2 from '@/components/hrs/Hr2';
import PrimaryColorSpan from '@/components/PrimaryColorSpan';
import {
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  RelayChainNativeTokenLogoIcon
} from '@/config/relay-chains';
import PriceInfo from '@/pages/Bridge/PriceInfo';
import RequestWrapper from '@/pages/Bridge/RequestWrapper';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const RetriedRedeemRequest = ({ request }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded, prices } = useSelector((state: StoreType) => state.general);
  const [punishmentCollateralTokenAmount, setPunishmentCollateralTokenAmount] = React.useState(
    newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
  );

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!request) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [punishmentFee, btcDotRate] = await Promise.all([
          window.bridge.vaults.getPunishmentFee(),
          window.bridge.oracle.getExchangeRate(RELAY_CHAIN_NATIVE_TOKEN)
        ]);

        const btcAmount = request.request.requestedAmountBacking;
        const theBurnDOTAmount = btcDotRate.toCounter(btcAmount);
        const thePunishmentDOTAmount = theBurnDOTAmount.mul(new Big(punishmentFee));
        setPunishmentCollateralTokenAmount(thePunishmentDOTAmount);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[RetriedRedeemRequest useEffect] error.message => ', error.message);
      }
    })();
  }, [request, bridgeLoaded]);

  return (
    <RequestWrapper>
      <h2 className={clsx('text-3xl', 'font-medium', 'text-interlayConifer')}>
        {t('redeem_page.compensation_success')}
      </h2>
      <p className='w-full'>{t('redeem_page.compensation_notice')}</p>
      <p className='font-medium'>
        <PrimaryColorSpan>{t('redeem_page.recover_receive_dot')}</PrimaryColorSpan>
        <PrimaryColorSpan>
          &nbsp;{`${displayMonetaryAmount(punishmentCollateralTokenAmount)} ${RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}`}
        </PrimaryColorSpan>
        <span>&nbsp;({`≈ $${getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken?.usd)}`})</span>
        <PrimaryColorSpan>&nbsp;{t('redeem_page.recover_receive_total')}.</PrimaryColorSpan>
      </p>
      <div className='w-full'>
        <PriceInfo
          title={
            <h5
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('redeem_page.compensation_payment')}
            </h5>
          }
          unitIcon={<RelayChainNativeTokenLogoIcon width={20} />}
          value={displayMonetaryAmount(punishmentCollateralTokenAmount)}
          unitName={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
          approxUSD={getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken?.usd)}
        />
        <Hr2 className={clsx('border-t-2', 'my-2.5')} />
        <PriceInfo
          className='w-full'
          title={
            <h5
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('you_received')}
            </h5>
          }
          unitIcon={<RelayChainNativeTokenLogoIcon width={20} />}
          value={displayMonetaryAmount(punishmentCollateralTokenAmount)}
          unitName={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
          approxUSD={getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken?.usd)}
        />
      </div>
      <ExternalLink className='text-sm' href={getPolkadotLink(request.request.height.absolute)}>
        {t('issue_page.view_parachain_block')}
      </ExternalLink>
      <div className='w-full'>
        <h6 className={clsx('flex', 'items-center', 'justify-center', 'space-x-0.5', 'text-interlayCinnabar')}>
          <span>{t('note')}</span>
          <FaExclamationCircle />
        </h6>
        <p
          className={clsx(
            'text-justify',
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {t('redeem_page.retry_new_redeem')}
        </p>
      </div>
    </RequestWrapper>
  );
};

export default RetriedRedeemRequest;
