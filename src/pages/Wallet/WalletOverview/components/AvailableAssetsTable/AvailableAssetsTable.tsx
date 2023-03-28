import { isCurrencyEqual } from '@interlay/interbtc-api';
import { useId } from '@react-aria/utils';
import { ReactNode, useMemo, useState } from 'react';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import {
  CTA,
  CTALink,
  Dd,
  Divider,
  Dl,
  DlGroup,
  Dt,
  Flex,
  H2,
  List,
  ListItem,
  P,
  Switch,
  theme
} from '@/component-library';
import { useMediaQuery } from '@/component-library/use-media-query';
import { AssetCell, Cell, Table } from '@/components';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { PAGES } from '@/utils/constants/links';
import { getCoinIconProps } from '@/utils/helpers/coin-icon';
import { getTokenPrice } from '@/utils/helpers/prices';
import { BalanceData } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ListItemWrapper } from './AvailableAssetsTable.style';

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
};

const AvailableAssetsTable = ({ balances }: AvailableAssetsTableProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  const prices = useGetPrices();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const columns = [
    { name: 'Asset', uid: AvailableAssetsColumns.ASSET },
    { name: 'Price', uid: AvailableAssetsColumns.PRICE },
    { name: 'Balance', uid: AvailableAssetsColumns.BALANCE },
    { name: '', uid: AvailableAssetsColumns.ACTIONS }
  ];

  const rows: AvailableAssetsRows[] = useMemo(() => {
    const data = balances ? Object.values(balances) : [];
    const filteredData = isOpen ? data : data.filter((balance) => !balance.free.isZero());

    return filteredData.map(
      ({ currency, free }): AvailableAssetsRows => {
        const asset = <AssetCell size={isMobile ? 'xl' : undefined} {...getCoinIconProps(currency)} />;

        const tokenPrice = getTokenPrice(prices, currency.ticker)?.usd || 0;

        const assetPriceLabel = formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0, { compact: true });
        const price = <Cell label={assetPriceLabel} />;

        const balanceLabel = free.toString();
        const balanceSublabel = formatUSD(convertMonetaryAmountToValueInUSD(free, tokenPrice) || 0, {
          compact: true
        });
        const balance = <Cell label={balanceLabel} sublabel={balanceSublabel} />;

        const actions = (
          <Flex justifyContent={isMobile ? undefined : 'flex-end'} gap='spacing1'>
            {isCurrencyEqual(currency, WRAPPED_TOKEN) && (
              <CTALink
                fullWidth={isMobile}
                to={{ pathname: PAGES.BRIDGE, search: 'tab=redeem' }}
                variant='outlined'
                size='small'
              >
                Redeem
              </CTALink>
            )}
            <CTALink fullWidth={isMobile} to={PAGES.TRANSFER} variant='outlined' size='small'>
              Transfer
            </CTALink>
            <CTALink fullWidth={isMobile} to={PAGES.SWAP} variant='outlined' size='small'>
              Swap
            </CTALink>
            {/* Missing the buy link */}
            <CTA fullWidth={isMobile} variant='outlined' size='small'>
              Buy
            </CTA>
          </Flex>
        );

        return {
          id: currency.ticker,
          asset,
          price,
          balance,
          actions
        };
      }
    );
  }, [balances, isMobile, isOpen, prices]);

  const actions = (
    <Switch isSelected={isOpen} onChange={(e) => setOpen(e.target.checked)}>
      Show Zero Balance
    </Switch>
  );

  const titleId = useId();

  if (isMobile) {
    return (
      <Flex direction='column' gap='spacing6' alignItems='stretch'>
        <Flex gap='spacing2' justifyContent='space-between'>
          <H2 size='xl' weight='bold' id={titleId}>
            Available assets
          </H2>
          {actions}
        </Flex>
        <List variant='card' aria-labelledby={titleId}>
          {rows.map((row) => (
            <ListItem key={row.id} textValue={row.id} direction='column'>
              <ListItemWrapper direction='column' gap='spacing2'>
                {row.asset}
                <Dl direction='column'>
                  <DlGroup justifyContent='space-between' alignItems='center'>
                    <Dt>{columns[1].name}</Dt>
                    <Dd>{row.price}</Dd>
                  </DlGroup>
                  <DlGroup justifyContent='space-between' alignItems='center'>
                    <Dt>{columns[2].name}</Dt>
                    <Dd>{row.balance}</Dd>
                  </DlGroup>
                </Dl>
                <Divider color='default' />
                {row.actions}
              </ListItemWrapper>
            </ListItem>
          ))}
        </List>
      </Flex>
    );
  }

  return (
    <Table
      actions={actions}
      title='Available assets'
      columns={columns}
      rows={rows}
      placeholder={<P weight='bold'>No Assets Available</P>}
    />
  );
};

export { AvailableAssetsTable };
export type { AvailableAssetsTableProps };
