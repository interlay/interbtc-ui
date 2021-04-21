
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import clsx from 'clsx';
import { BtcNetworkName } from '@interlay/polkabtc-stats';

import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import {
  StyledLinkData,
  StatusComponent,
  StatusCategories
} from 'common/components/dashboard-table/dashboard-table';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import {
  shortAddress,
  formatDateTimePrecise
} from 'common/utils/utils';
import { DashboardRequestInfo } from 'common/types/redeem.types';
import * as constants from '../../constants';

const STATUS = 'status';

const RedeemRequestsTable = (): JSX.Element => {
  const statsApi = usePolkabtcStats();
  const [data, setData] = React.useState<DashboardRequestInfo[]>([]);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!statsApi) return;

    try {
      (async () => {
        const response = await statsApi.getRedeems(
          // TODO: should handle via query parameters
          0,
          20,
          undefined,
          undefined,
          // TODO: should double-check
          constants.BITCOIN_NETWORK as BtcNetworkName
        );
        const transformedRedeemRequests = response.data.map(item => ({
          ...item,
          [STATUS]: {
            completed: item.completed,
            cancelled: item.cancelled,
            isExpired: item.isExpired,
            reimbursed: item.reimbursed
          }
        }));
        setData(transformedRedeemRequests);
      })();
    } catch (error) {
      console.error('[RedeemDashboard useEffect] error.message => ', error.message);
    }
  }, [statsApi]);

  const columns = React.useMemo(
    () => [
      {
        Header: t('date'),
        accessor: 'timestamp',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }) {
          return (
            <>
              {formatDateTimePrecise(new Date(value))}
            </>
          );
        }
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
        ],
        Cell: function FormattedCell({ value }) {
          return (
            <>
              {shortAddress(value)}
            </>
          );
        }
      },
      {
        Header: t('redeem_page.output_BTC_address'),
        accessor: 'btcAddress',
        classNames: [
          'text-left'
        ],
        // ray test touch <
        Cell: function FormattedCell({ value }) {
          return (
            <StyledLinkData
              data={shortAddress(value)}
              target={
                (constants.BTC_MAINNET ?
                  constants.BTC_EXPLORER_ADDRESS_API :
                  constants.BTC_TEST_EXPLORER_ADDRESS_API) + value
              }
              newTab={true} />
          );
        }
        // ray test touch >
      },
      {
        Header: t('status'),
        accessor: STATUS,
        classNames: [
          'text-left'
        ],
        // ray test touch <
        Cell: function FormattedCell({ value }) {
          return (
            <StatusComponent
              {...(value.completed ?
                { text: t('completed'), category: StatusCategories.Ok } :
                value.cancelled ?
                  { text: t('cancelled'), category: StatusCategories.Bad } :
                  value.isExpired ?
                    { text: t('expired'), category: StatusCategories.Bad } :
                    value.reimbursed ?
                      { text: t('reimbursed'), category: StatusCategories.Ok } :
                      { text: t('pending'), category: StatusCategories.Warning })} />
          );
        }
        // ray test touch >
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
      <h2
        className={clsx(
          'text-2xl',
          'font-bold'
        )}>
        {t('issue_page.recent_requests')}
      </h2>
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
