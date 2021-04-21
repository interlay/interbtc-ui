
// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import clsx from 'clsx';
import {
  BtcNetworkName,
  RedeemColumns
} from '@interlay/polkabtc-stats';

import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import {
  defaultTableDisplayParams
  // shortAddress,
  // formatDateTimePrecise
} from 'common/utils/utils';
import { DashboardRequestInfo } from 'common/types/redeem.types';
import * as constants from '../../constants';

const RedeemRequestsTable = (): JSX.Element => {
  const statsApi = usePolkabtcStats();
  const [data, setData] = React.useState<DashboardRequestInfo[]>([]);
  // TODO: should handle via query parameters
  const [tableParams] = React.useState(defaultTableDisplayParams<RedeemColumns>());
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!statsApi) return;

    try {
      (async () => {
        const response = await statsApi.getRedeems(
          tableParams.page,
          tableParams.perPage,
          tableParams.sortBy,
          tableParams.sortAsc,
          // TODO: should double-check
          constants.BITCOIN_NETWORK as BtcNetworkName
        );
        setData(response.data);
      })();
    } catch (error) {
      console.error('[RedeemDashboard useEffect] error.message => ', error.message);
    }
  }, [
    statsApi,
    tableParams.page,
    tableParams.perPage,
    tableParams.sortBy,
    tableParams.sortAsc
  ]);

  const columns = React.useMemo(
    () => [
      {
        Header: t('date'),
        accessor: 'timestamp',
        classNames: [
          'text-left'
        ]
      },
      {
        Header: t('redeem_page.amount'),
        accessor: 'amountPolkaBTC',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('parachain_block'),
        accessor: 'creation',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('issue_page.vault_dot_address'),
        accessor: 'vaultDotAddress',
        classNames: [
          'text-left'
        ]
      },
      {
        Header: t('redeem_page.output_BTC_address'),
        accessor: 'btcAddress',
        classNames: [
          'text-left'
        ]
      },
      {
        Header: t('status'),
        accessor: 'completed',
        classNames: [
          'text-left'
        ]
      }
    ],
    [t]
  );

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

  return (
    <InterlayTableContainer>
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

export default RedeemRequestsTable;
// ray test touch >
