
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

import RedeemModal from '../modal/RedeemModal';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import InterlayLink from 'components/UI/InterlayLink';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { shortTxId } from 'common/utils/utils';
import { RedeemRequestStatus } from 'common/types/redeem.types';
import { StoreType } from 'common/types/util.types';
import { changeRedeemIdAction } from 'common/actions/redeem.actions';
import { formatDateTimePrecise } from 'common/utils/utils';

const RedeemRequestsTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { address } = useSelector((state: StoreType) => state.general);
  const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];
  const [redeemModalOpen, setRedeemModalOpen] = React.useState(false);

  const handleRedeemModalClose = () => {
    setRedeemModalOpen(false);
  };

  const handleRowClick = (requestId: string) => () => {
    dispatch(changeRedeemIdAction(requestId));
    setRedeemModalOpen(true);
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
        Header: `${t('redeem_page.amount')} (InterBTC)`,
        accessor: 'amountPolkaBTC',
        classNames: [
          'text-right'
        ]
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
              {
                (
                  props.row.original.status === RedeemRequestStatus.Expired ||
                  props.row.original.status === RedeemRequestStatus.Retried ||
                  props.row.original.status === RedeemRequestStatus.Reimbursed
                ) ? (
                    t('redeem_page.failed')
                  ) : (
                    <>
                      {/* TODO: could componentize */}
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
                        `${t('pending')}...`
                      )}
                    </>
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
          case RedeemRequestStatus.Reimbursed: {
            icon = <FaCheck />; // TODO: should update according to the design
            notice = t('redeem_page.reimbursed');
            colorClassName = 'text-interlayConifer'; // TODO: should update according to the design
            break;
          }
          case RedeemRequestStatus.Expired: {
            icon = <FaRegTimesCircle />;
            notice = t('redeem_page.recover');
            colorClassName = 'text-interlayCinnabar';
            break;
          }
          case RedeemRequestStatus.Retried: {
            icon = <FaCheck />;
            notice = t('redeem_page.retried');
            colorClassName = 'text-interlayConifer';
            break;
          }
          case RedeemRequestStatus.Completed: {
            icon = <FaCheck />;
            notice = t('completed');
            colorClassName = 'text-interlayConifer';
            break;
          }
          default: {
            icon = <FaRegClock />;
            notice = t('pending');
            colorClassName = 'text-interlayOrangePeel';
            break;
          }
          }

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

  const data = redeemRequests;

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
        <h2
          className={clsx(
            'text-2xl',
            'font-bold'
          )}>
          {t('redeem_requests')}
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
      <RedeemModal
        open={redeemModalOpen}
        onClose={handleRedeemModalClose} />
    </>
  );
};

export default RedeemRequestsTable;
