import {
  CollateralCurrencyExt,
  InterbtcPrimitivesVaultId,
  ReplaceRequestExt,
  stripHexPrefix,
  WrappedCurrency
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { H256 } from '@polkadot/types/interfaces';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useTable } from 'react-table';

import { StoreType } from '@/common/types/util.types';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import SectionTitle from '@/legacy-components/SectionTitle';
import InterlayTable, {
  InterlayTableContainer,
  InterlayTbody,
  InterlayTd,
  InterlayTh,
  InterlayThead,
  InterlayTr
} from '@/legacy-components/UI/InterlayTable';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';

interface Props {
  vaultAddress: string;
  collateralTokenTicker: string;
}

const ReplaceTable = ({ vaultAddress, collateralTokenTicker }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const vaultId = window.bridge?.api.createType(ACCOUNT_ID_TYPE_NAME, vaultAddress);
  const {
    isIdle: replaceRequestsIdle,
    isLoading: replaceRequestsLoading,
    data: replaceRequests,
    error: replaceRequestsError
  } = useQuery<Map<H256, ReplaceRequestExt>, Error>(
    [GENERIC_FETCHER, 'replace', 'mapReplaceRequests', vaultId],
    genericFetcher<Map<H256, ReplaceRequestExt>>(),
    {
      enabled: !!bridgeLoaded && !!collateralTokenTicker,
      refetchInterval: ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
    }
  );
  useErrorHandler(replaceRequestsError);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        classNames: ['text-center'],
        Cell: function FormattedCell({ value }: { value: H256 }) {
          return <AddressWithCopyUI address={stripHexPrefix(value.toString())} />;
        }
      },
      {
        Header: t('vault.creation_block'),
        accessor: 'btcHeight',
        classNames: ['text-center']
      },
      {
        Header: t('vault.old_vault'),
        accessor: 'oldVault',
        classNames: ['text-center'],
        Cell: function FormattedCell({ value }: { value: InterbtcPrimitivesVaultId }) {
          return <AddressWithCopyUI address={value.accountId.toString()} />;
        }
      },
      {
        Header: t('vault.new_vault'),
        accessor: 'newVault',
        classNames: ['text-center'],
        Cell: function FormattedCell({ value }: { value: InterbtcPrimitivesVaultId }) {
          return <AddressWithCopyUI address={value.accountId.toString()} />;
        }
      },
      {
        Header: t('btc_address'),
        accessor: 'btcAddress',
        classNames: ['text-center'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <AddressWithCopyUI address={value} />;
        }
      },
      {
        Header: WRAPPED_TOKEN_SYMBOL,
        accessor: 'amount',
        classNames: ['text-right'],
        Cell: function FormattedCell({ value }: { value: MonetaryAmount<WrappedCurrency> }) {
          return <>{value.toHuman(8)}</>;
        }
      },
      {
        Header: t('griefing_collateral'),
        accessor: 'collateral',
        classNames: ['text-right'],
        Cell: function FormattedCell({ value }: { value: MonetaryAmount<CollateralCurrencyExt> }) {
          return <>{value.toHuman(5)}</>;
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: ['text-center'],
        Cell: function FormattedCell({ value }: { value: ReplaceRequestExt['status'] }) {
          let label;
          if (value.isPending) {
            label = t('pending');
          } else if (value.isCompleted) {
            label = t('completed');
          } else if (value.isCancelled) {
            label = t('cancelled');
          } else {
            label = t('loading_ellipsis');
          }
          return <>{label}</>;
        }
      }
    ],
    [t]
  );

  const data = replaceRequests
    ? [
        ...replaceRequests
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          .filter((request) => request?.collateral?.currency?.ticker === collateralTokenTicker)
          .entries()
      ].map(([key, value]) => ({
        id: key,
        ...value
      }))
    : [];
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  if (replaceRequestsIdle || replaceRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (replaceRequests === undefined) {
    throw new Error('Something went wrong!');
  }

  return (
    <InterlayTableContainer className={clsx('space-y-6', 'container', 'mx-auto')}>
      <SectionTitle>{t('vault.replace_requests')}</SectionTitle>
      <InterlayTable {...getTableProps()}>
        <InterlayThead>
          {headerGroups.map((headerGroup: any) => (
            // eslint-disable-next-line react/jsx-key
            <InterlayTr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                // eslint-disable-next-line react/jsx-key
                <InterlayTh
                  {...column.getHeaderProps([
                    {
                      className: clsx(column.classNames),
                      style: column.style
                    }
                  ])}
                >
                  {column.render('Header')}
                </InterlayTh>
              ))}
            </InterlayTr>
          ))}
        </InterlayThead>
        <InterlayTbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);

            return (
              // eslint-disable-next-line react/jsx-key
              <InterlayTr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <InterlayTd
                      {...cell.getCellProps([
                        {
                          className: clsx(cell.column.classNames),
                          style: cell.column.style
                        }
                      ])}
                    >
                      {cell.render('Cell')}
                    </InterlayTd>
                  );
                })}
              </InterlayTr>
            );
          })}
        </InterlayTbody>
      </InterlayTable>
    </InterlayTableContainer>
  );
};

export default withErrorBoundary(ReplaceTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
