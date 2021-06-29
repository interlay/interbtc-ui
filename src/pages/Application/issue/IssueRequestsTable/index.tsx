
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useTable } from 'react-table';
import {
  FaCheck,
  FaRegTimesCircle,
  FaRegClock,
  FaExternalLinkAlt
} from 'react-icons/fa';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import IssueModal from '../modal/IssueModal';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import InterlayLink from 'components/UI/InterlayLink';
import { IssueRequestStatus } from 'common/types/issue.types';
import { StoreType } from 'common/types/util.types';
import { formatDateTimePrecise } from 'common/utils/utils';
import { changeIssueIdAction } from 'common/actions/issue.actions';
import { showAccountModalAction } from 'common/actions/general.actions';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { shortTxId } from 'common/utils/utils';

const IssueRequestsTable = (): JSX.Element => {
  const {
    address,
    extensions
  } = useSelector((state: StoreType) => state.general);
  const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];
  const [issueModalOpen, setIssueModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleIssueModalClose = () => {
    setIssueModalOpen(false);
  };

  const openWizard = () => {
    if (extensions.length && address) {
      setIssueModalOpen(true);
    } else {
      dispatch(showAccountModalAction(true));
    }
  };

  const handleRowClick = (requestId: string) => () => {
    dispatch(changeIssueIdAction(requestId));
    openWizard();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: t('issue_page.updated'),
        accessor: 'timestamp',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }) {
          return (
            <>
              {value ? formatDateTimePrecise(new Date(Number(value))) : t('pending')}
            </>
          );
        }
      },
      {
        Header: `${t('issue_page.amount')} (InterBTC)`,
        accessor: 'issuedAmountBtc',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell(props) {
          return (
            <>
              {props.row.original.issuedAmountBtc || props.row.original.requestedAmountPolkaBTC}
            </>
          );
        }
      },
      {
        Header: t('issue_page.btc_transaction'),
        accessor: 'btcTxId',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell(props) {
          return (
            <>
              {props.row.original.btcTxId ? (
                <InterlayLink
                  className={clsx(
                    'text-interlayDodgerBlue',
                    'space-x-1.5',
                    'inline-flex',
                    'items-center'
                  )}
                  href={`${BTC_TRANSACTION_API}${props.row.original.btcTxId}`}
                  onClick={event => {
                    event.stopPropagation();
                  }}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <span>{shortTxId(props.row.original.btcTxId)}</span>
                  <FaExternalLinkAlt />
                </InterlayLink>
              ) : (
                (
                  props.row.original.status === IssueRequestStatus.Expired ||
                  props.row.original.status === IssueRequestStatus.Cancelled
                ) ? (
                    t('redeem_page.failed')
                  ) : (
                    `${t('pending')}...`
                  )
              )}
            </>
          );
        }
      },
      {
        Header: t('issue_page.confirmations'),
        accessor: 'confirmations',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell(props) {
          return (
            <>
              {props.row.original.btcTxId === '' ?
                t('not_applicable') :
                Math.max(props.row.original.confirmations, 0)}
            </>
          );
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }) {
          let icon;
          let notice;
          let colorClassName;
          switch (value) {
          case IssueRequestStatus.RequestedRefund:
          case IssueRequestStatus.Completed: {
            icon = <FaCheck />;
            notice = t('completed');
            colorClassName = 'text-interlayMalachite';
            break;
          }
          case IssueRequestStatus.Cancelled:
          case IssueRequestStatus.Expired: {
            icon = <FaRegTimesCircle />;
            notice = t('cancelled');
            colorClassName = 'text-interlayScarlet';
            break;
          }
          default: {
            icon = <FaRegClock />;
            notice = t('pending');
            colorClassName = 'text-interlayOrangePeel';
            break;
          }
          }

          // TODO: double-check with `src\components\UI\InterlayTable\StatusCell\index.tsx`
          return (
            <div
              className={clsx(
                'inline-flex',
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

  const data = issueRequests;

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

  if (data.length === 0) return null;

  return (
    <>
      <InterlayTableContainer
        className={clsx(
          'space-y-6',
          'container',
          'mx-auto'
        )}>
        <div>
          <h2
            className={clsx(
              'text-2xl',
              'font-bold'
            )}>
            {t('issue_page.issue_requests')}
          </h2>
          <p>
            {t('issue_page.click_on_issue_request')}
          </p>
        </div>
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

              const {
                className: rowClassName,
                ...restRowProps
              } = row.getRowProps();

              return (
                // eslint-disable-next-line react/jsx-key
                <InterlayTr
                  className={clsx(
                    rowClassName,
                    'cursor-pointer'
                  )}
                  {...restRowProps}
                  onClick={handleRowClick(row.original.id)}>
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
      <IssueModal
        open={issueModalOpen}
        onClose={handleIssueModalClose} />
    </>
  );
};

export default IssueRequestsTable;
