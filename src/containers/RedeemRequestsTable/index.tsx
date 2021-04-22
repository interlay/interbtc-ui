
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import {
  FaRegCheckCircle,
  FaRegClock,
  FaRegTimesCircle,
  FaUserClock,
  FaClipboardCheck,
  FaExternalLinkAlt
} from 'react-icons/fa';
import clsx from 'clsx';
import { BtcNetworkName } from '@interlay/polkabtc-stats';

import EllipsisLoader from 'components/EllipsisLoader';
import ErrorMessage from 'components/ErrorMessage';
import Pagination from 'components/Pagination';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import InterlayLink from 'components/UI/InterlayLink';
import useQuery from 'utils/hooks/use-query';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import {
  shortAddress,
  formatDateTimePrecise
} from 'common/utils/utils';
import { DashboardRequestInfo } from 'common/types/redeem.types';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import * as constants from '../../constants';
import STATUSES from 'utils/constants/statuses';

const PAGE_SIZE = 20;

interface Props {
  totalRedeemRequests: number;
}

const RedeemRequestsTable = ({
  totalRedeemRequests
}: Props): JSX.Element | null => {
  const query = useQuery();
  const selectedPage: number = query.get(QUERY_PARAMETERS.page);
  const updateQueryParameters = useUpdateQueryParameters();
  const statsApi = usePolkabtcStats();
  const [data, setData] = React.useState<DashboardRequestInfo[]>([]);
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [error, setError] = React.useState<Error | null>(null);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!statsApi) return;
    if (!selectedPage) return;

    const selectedPageIndex = selectedPage - 1;

    try {
      (async () => {
        setStatus(STATUSES.PENDING);
        const response = await statsApi.getRedeems(
          selectedPageIndex,
          PAGE_SIZE,
          undefined,
          undefined,
          // TODO: should double-check
          constants.BITCOIN_NETWORK as BtcNetworkName
        );
        setStatus(STATUSES.RESOLVED);
        setData(response.data);
      })();
    } catch (error) {
      setStatus(STATUSES.REJECTED);
      setError(error);
    }
  }, [
    statsApi,
    selectedPage
  ]);

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
        Cell: function FormattedCell({ value }) {
          return (
            <InterlayLink
              className={clsx(
                'text-interlayDodgerBlue',
                'space-x-1.5',
                'flex',
                'items-center'
              )}
              // TODO: should define such variables in `config`
              // eslint-disable-next-line max-len
              href={`${constants.BTC_MAINNET ? constants.BTC_EXPLORER_ADDRESS_API : constants.BTC_TEST_EXPLORER_ADDRESS_API}${value}`}
              target='_blank'
              rel='noopener noreferrer'>
              <span>{shortAddress(value)}</span>
              <FaExternalLinkAlt />
            </InterlayLink>
          );
        }
      },
      {
        Header: t('status'),
        classNames: [
          'text-left'
        ],
        // TODO: should be reusable (progressively)
        Cell: function FormattedCell(props) {
          // TODO: should double-check with the designer
          let icon;
          let notice;
          let colorClassName;
          switch (true) {
          case props.row.original.completed:
            icon = <FaRegCheckCircle />;
            notice = t('completed');
            colorClassName = 'text-interlayMalachite';
            break;
          case props.row.original.cancelled:
            icon = <FaRegTimesCircle />;
            notice = t('cancelled');
            colorClassName = 'text-interlayScarlet';
            break;
          case props.row.original.isExpired:
            icon = <FaUserClock />;
            notice = t('expired');
            colorClassName = 'text-interlayScarlet';
            break;
          case props.row.original.reimbursed:
            icon = <FaClipboardCheck />;
            notice = t('reimbursed');
            colorClassName = 'text-interlayMalachite';
            break;
          default:
            icon = <FaRegClock />;
            notice = t('pending');
            colorClassName = 'text-interlayTreePoppy';
            break;
          }

          return (
            <div
              className={clsx(
                'flex',
                'items-center',
                'space-x-1.5',
                colorClassName
              )}>
              {icon}
              <span>
                {notice}
              </span>
            </div>
          );
        }
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

  if (status === STATUSES.REJECTED) {
    return (
      <ErrorMessage message={error?.message} />
    );
  }

  if (!selectedPage) {
    updateQueryParameters({
      [QUERY_PARAMETERS.page]: 1
    });

    return null;
  }

  // ray test touch <
  // COMPONENTIZING
  // CONFIGURATION
  // ray test touch >

  const handlePageChange = (newPage: number) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.page]: newPage
    });
  };

  return (
    <InterlayTableContainer className='space-y-6'>
      <h2
        className={clsx(
          'text-2xl',
          'font-bold'
        )}>
        {t('issue_page.recent_requests')}
      </h2>
      {(status === STATUSES.IDLE || status === STATUSES.PENDING) && (
        <div
          className={clsx(
            'flex',
            'justify-center'
          )}>
          <EllipsisLoader dotClassName='bg-interlayTreePoppy-light' />
        </div>
      )}
      {status === STATUSES.RESOLVED && (
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
      )}
      {totalRedeemRequests > 0 && (
        <Pagination
          pageSize={PAGE_SIZE}
          total={totalRedeemRequests}
          current={selectedPage}
          onChange={handlePageChange} />
      )}
    </InterlayTableContainer>
  );
};

export default RedeemRequestsTable;
