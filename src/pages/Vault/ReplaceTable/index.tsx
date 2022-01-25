
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import {
  H256,
  AccountId
} from '@polkadot/types/interfaces';
import clsx from 'clsx';
import {
  stripHexPrefix,
  ReplaceRequestExt,
  WrappedCurrency
} from '@interlay/interbtc-api';
import { ReplaceRequestStatus } from '@interlay/interbtc-api/build/src/interfaces';
import {
  MonetaryAmount,
  Currency,
  BitcoinUnit,
  CollateralUnit
} from '@interlay/monetary-js';

import SectionTitle from 'parts/SectionTitle';
import ErrorFallback from 'components/ErrorFallback';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';
import {
  shortAddress,
  displayMonetaryAmount
} from 'common/utils/utils';

interface Props {
  vaultAddress: string;
}

const ReplaceTable = ({
  vaultAddress
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const vaultId = window.bridge?.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, vaultAddress);
  const {
    isIdle: replaceRequestsIdle,
    isLoading: replaceRequestsLoading,
    data: replaceRequests,
    error: replaceRequestsError
  } = useQuery<Map<H256, ReplaceRequestExt>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'replace',
      'mapReplaceRequests',
      vaultId
    ],
    genericFetcher<Map<H256, ReplaceRequestExt>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(replaceRequestsError);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: { value: H256; }) {
          return (
            <>{stripHexPrefix(value.toString())}</>
          );
        }
      },
      {
        Header: t('vault.creation_block'),
        accessor: 'btcHeight',
        classNames: [
          'text-center'
        ]
      },
      {
        Header: t('vault.old_vault'),
        accessor: 'oldVault',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: { value: AccountId; }) {
          return (
            <>{shortAddress(value.toString())}</>
          );
        }
      },
      {
        Header: t('vault.new_vault'),
        accessor: 'newVault',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: { value: AccountId; }) {
          return (
            <>{shortAddress(value.toString())}</>
          );
        }
      },
      {
        Header: t('btc_address'),
        accessor: 'btcAddress',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: { value: string; }) {
          return (
            <>{shortAddress(value)}</>
          );
        }
      },
      {
        Header: WRAPPED_TOKEN_SYMBOL,
        accessor: 'amount',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }: { value: MonetaryAmount<WrappedCurrency, BitcoinUnit>; }) {
          return (
            <>{displayMonetaryAmount(value)}</>
          );
        }
      },
      {
        Header: t('griefing_collateral'),
        accessor: 'collateral',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }: { value: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>; }) {
          return (
            <>{displayMonetaryAmount(value)}</>
          );
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: { value: ReplaceRequestStatus; }) {
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
          return (
            <>{label}</>
          );
        }
      }
    ],
    [t]
  );

  const data =
    replaceRequests ?
      [...replaceRequests.entries()].map(([key, value]) => ({
        id: key,
        ...value
      })) :
      [];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    }
  );

  if (
    replaceRequestsIdle ||
    replaceRequestsLoading
  ) {
    return (
      <PrimaryColorEllipsisLoader />
    );
  }
  if (replaceRequests === undefined) {
    throw new Error('Something went wrong!');
  }

  return (
    <InterlayTableContainer
      className={clsx(
        'space-y-6',
        'container',
        'mx-auto'
      )}>
      <SectionTitle>
        {t('vault.replace_requests')}
      </SectionTitle>
      <InterlayTable {...getTableProps()}>
        <InterlayThead>
          {headerGroups.map(headerGroup => (
            // eslint-disable-next-line react/jsx-key
            <InterlayTr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // eslint-disable-next-line react/jsx-key
                <InterlayTh
                  {...column.getHeaderProps([
                    {
                      className: clsx(column.classNames),
                      style: column.style
                    }
                  ])}>
                  {column.render('Header')}
                </InterlayTh>
              ))}
            </InterlayTr>
          ))}
        </InterlayThead>
        <InterlayTbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);

            return (
              // eslint-disable-next-line react/jsx-key
              <InterlayTr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <InterlayTd
                      {...cell.getCellProps([
                        {
                          className: clsx(cell.column.classNames),
                          style: cell.column.style
                        }
                      ])}>
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
