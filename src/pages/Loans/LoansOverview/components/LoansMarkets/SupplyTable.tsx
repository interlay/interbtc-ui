import { useId } from '@react-aria/utils';
import { Key, ReactNode, useState } from 'react';

import { Card, CoinIcon, H2, Span, Stack, Table } from '@/component-library';
import { SupplyAssetData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { SupplyModal } from '../SupplyModal';
import { StyledApyTag, StyledAsset, StyledTableWrapper } from './LoansMarkets.style';

enum SupplyTableColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET_BALANCE = 'wallet-balance'
}

// TODO: translations
const columns = [
  { name: 'Asset', uid: SupplyTableColumns.ASSET },
  { name: 'APY', uid: SupplyTableColumns.APY },
  { name: 'Wallet Balance', uid: SupplyTableColumns.WALLET_BALANCE }
];

type SupplyTableRow = {
  id: number;
  [SupplyTableColumns.ASSET]: ReactNode;
  [SupplyTableColumns.APY]: ReactNode;
  [SupplyTableColumns.WALLET_BALANCE]: string;
};

type SupplyTableProps = {
  data: SupplyAssetData[];
};

const SupplyTable = ({ data }: SupplyTableProps): JSX.Element => {
  const titleId = useId();
  const [currentAsset, setAsset] = useState<SupplyAssetData | null>(null);

  const handleRowAction = (key: Key) => setAsset(data[key as number]);

  const handleClose = () => setAsset(null);

  const supplyTableData: SupplyTableRow[] = data.map(({ apy, apyAssets, currency, balance }, key) => {
    const apyWithEarnedAssets = (
      <Stack spacing='half'>
        <Span>{apy}</Span>
        <StyledApyTag>Earn: {apyAssets.join(' / ')}</StyledApyTag>
      </Stack>
    );

    const assetWithIcon = (
      <StyledAsset>
        <CoinIcon coin={currency} size='small' />
        <Span>{currency}</Span>
      </StyledAsset>
    );

    return { id: key, asset: assetWithIcon, apy: apyWithEarnedAssets, 'wallet-balance': balance };
  });

  return (
    <StyledTableWrapper>
      <H2 id={titleId}>Supply</H2>
      <Card>
        <Table onRowAction={handleRowAction} aria-labelledby={titleId} rows={supplyTableData} columns={columns} />
      </Card>
      <SupplyModal open={!!currentAsset} asset={currentAsset} onClose={handleClose} />
    </StyledTableWrapper>
  );
};

export { SupplyTable };
export type { SupplyTableProps, SupplyTableRow };
