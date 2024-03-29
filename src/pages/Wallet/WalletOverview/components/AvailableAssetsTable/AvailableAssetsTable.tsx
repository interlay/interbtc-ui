import { isCurrencyEqual } from '@interlay/interbtc-api';
import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { P, Switch, TextLink, theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/utils/use-media-query';
import { Cell } from '@/components';
import { AssetCell, DataGrid } from '@/components/DataGrid';
import { INTERLAY_GET_ASSETS_LINK } from '@/config/links';
import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { BalanceData } from '@/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { useGetVestingData } from '@/hooks/api/use-get-vesting-data';
import { FEE_TICKERS } from '@/utils/constants/currency';
import { EXTERNAL_QUERY_PARAMETERS } from '@/utils/constants/links';
import { getCoinIconProps } from '@/utils/helpers/coin-icon';
import { getTokenPrice } from '@/utils/helpers/prices';

import { ActionsCell, EXTERNAL_SWAP_LINKS } from './ActionsCell';

const queryString = require('query-string');

enum AvailableAssetsColumns {
  ASSET = 'asset',
  PRICE = 'price',
  BALANCE = 'balance',
  ACTIONS = 'actions'
}

type AvailableAssetsRows = {
  id: string;
  [AvailableAssetsColumns.ASSET]: ReactNode;
  [AvailableAssetsColumns.PRICE]: ReactNode;
  [AvailableAssetsColumns.BALANCE]: ReactNode;
  [AvailableAssetsColumns.ACTIONS]: ReactNode;
};

type AvailableAssetsTableProps = {
  balances?: BalanceData;
  pooledTickers?: Set<string>;
};

const AvailableAssetsTable = ({ balances, pooledTickers }: AvailableAssetsTableProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { data: vestingData } = useGetVestingData();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isFeeToken = (ticker: string) => FEE_TICKERS.includes(ticker);

  const [showAllBalances, setShowAllBalances] = useState(false);

  const rows: AvailableAssetsRows[] = useMemo(() => {
    const data = balances ? Object.values(balances) : [];

    const filteredData = showAllBalances
      ? data
      : data.filter((balance) => isFeeToken(balance.currency.ticker) || !balance.transferable.isZero());

    return filteredData.map(
      ({ currency, transferable }): AvailableAssetsRows => {
        const tooltip = isFeeToken(currency.ticker) && (
          <TextLink
            color='secondary'
            size='s'
            external
            icon
            to={{
              pathname: INTERLAY_GET_ASSETS_LINK,
              search: queryString.stringify({
                [EXTERNAL_QUERY_PARAMETERS.DOCS.ASSET.ID]: currency.ticker.toLowerCase()
              })
            }}
          >
            {t('wallet_page.get_asset', { token: currency.ticker })}
          </TextLink>
        );

        const asset = (
          <AssetCell
            size={isMobile ? 'xl2' : undefined}
            textSize={isMobile ? 'base' : undefined}
            marginBottom={isMobile ? 'spacing4' : undefined}
            {...getCoinIconProps(currency)}
            tooltip={tooltip}
          />
        );

        const tokenPrice = getTokenPrice(prices, currency.ticker)?.usd || 0;

        const assetPriceLabel = formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0, { compact: true });
        const price = <Cell label={assetPriceLabel} />;

        const balanceLabel = transferable.toString();
        const balanceSublabel = formatUSD(convertMonetaryAmountToValueInUSD(transferable, tokenPrice) || 0, {
          compact: true
        });
        const balance = (
          <Cell alignItems={isMobile ? 'flex-end' : undefined} label={balanceLabel} sublabel={balanceSublabel} />
        );

        const isWrappedToken = isCurrencyEqual(currency, WRAPPED_TOKEN);
        const isRedeemable = isWrappedToken && !transferable.isZero();
        const swappableToken = pooledTickers?.has(currency.ticker)
          ? 'internal'
          : Object.keys(EXTERNAL_SWAP_LINKS).includes(currency.ticker)
          ? 'external'
          : undefined;
        const isGovernanceToken = isCurrencyEqual(currency, GOVERNANCE_TOKEN);
        const isVestingClaimable = isGovernanceToken && !!vestingData?.isClaimable;

        const hasActions = isRedeemable || !!swappableToken || isVestingClaimable;

        const actions = hasActions ? (
          <ActionsCell
            swappableToken={swappableToken}
            isRedeemable={isRedeemable}
            isGovernanceToken={isGovernanceToken}
            isWrappedToken={isWrappedToken}
            isVestingClaimable={isVestingClaimable}
            currency={currency}
          />
        ) : null;

        return {
          id: currency.ticker,
          asset,
          price,
          balance,
          actions
        };
      }
    );
  }, [balances, showAllBalances, isMobile, prices, pooledTickers, vestingData?.isClaimable, t]);

  const actions = (
    <Switch isSelected={showAllBalances} onChange={(e) => setShowAllBalances(e.target.checked)}>
      {t('show_all')}
    </Switch>
  );

  const columns = [
    { name: isMobile ? '' : t('asset'), uid: AvailableAssetsColumns.ASSET },
    { name: t('price'), uid: AvailableAssetsColumns.PRICE },
    { name: t('balance'), uid: AvailableAssetsColumns.BALANCE },
    { name: '', uid: AvailableAssetsColumns.ACTIONS }
  ];

  return (
    <DataGrid
      actions={actions}
      title={t('wallet_page.available_assets')}
      columns={columns}
      rows={rows}
      placeholder={<P weight='bold'>{t('wallet_page.no_assets_available')}</P>}
    />
  );
};

export { AvailableAssetsTable };
export type { AvailableAssetsTableProps };
