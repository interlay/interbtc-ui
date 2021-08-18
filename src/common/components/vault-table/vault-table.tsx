
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import Big from 'big.js';
import clsx from 'clsx';
import {
  roundTwoDecimals,
  VaultStatusExt
} from '@interlay/interbtc';
import {
  Bitcoin,
  BTCAmount,
  BTCUnit,
  ExchangeRate,
  Polkadot,
  PolkadotAmount,
  PolkadotUnit
} from '@interlay/monetary-js';

import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import InterlayTooltip from 'components/UI/InterlayTooltip';
import { shortAddress } from '../../utils/utils';
import * as constants from '../../../constants';
import { StoreType } from 'common/types/util.types';
import { Vault } from '../../types/vault.types';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

const getCollateralization = (
  collateral: PolkadotAmount,
  tokens: BTCAmount,
  btcToDOTRate: ExchangeRate<Bitcoin, BTCUnit, Polkadot, PolkadotUnit>
) => {
  if (tokens.gt(BTCAmount.zero) && btcToDOTRate.toBig().gt(0)) {
    const tokensAsCollateral = btcToDOTRate.toCounter(tokens);
    return collateral.toBig().div(tokensAsCollateral.toBig()).mul(100);
  } else {
    return undefined;
  }
};

const getCollateralizationColor = (
  collateralization: string | undefined,
  secureCollateralThreshold: Big
): string | null => {
  if (collateralization === undefined) return null;

  if (new Big(collateralization).gte(secureCollateralThreshold)) {
    return clsx(
      'text-interlayConifer',
      'font-medium'
    );
  } else {
    // Liquidation
    return clsx(
      'text-interlayCinnabar',
      'font-medium'
    );
  }
};

const VaultTable = (): JSX.Element => {
  const [vaults, setVaults] = React.useState<Array<Vault>>([]);
  const { t } = useTranslation();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const [secureCollateralThreshold, setSecureCollateralThreshold] = React.useState(new Big(0));

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

    (async () => {
      try {
        const [
          theSecureCollateralThreshold,
          theLiquidationThreshold,
          theBTCToDOTRate,
          theVaultsExt
        ] = await Promise.all([
          window.polkaBTC.vaults.getSecureCollateralThreshold(),
          window.polkaBTC.vaults.getLiquidationCollateralThreshold(),
          window.polkaBTC.oracle.getExchangeRate(Polkadot),
          window.polkaBTC.vaults.list()
        ]);
        setSecureCollateralThreshold(theSecureCollateralThreshold);

        const theVaults: Vault[] = [];
        for (const vault of theVaultsExt) {
          const vaultCollateral = vault.backingCollateral;
          const unsettledTokens = vault.toBeIssuedTokens;
          const settledTokens = vault.issuedTokens;
          const unsettledCollateralization =
            getCollateralization(vaultCollateral, unsettledTokens.add(settledTokens), theBTCToDOTRate);
          const settledCollateralization = getCollateralization(vaultCollateral, settledTokens, theBTCToDOTRate);

          const btcAddress = vault.wallet.publicKey; // TODO: get address(es)?

          let statusText;
          if (vault.status === VaultStatusExt.CommittedTheft) {
            statusText = t('dashboard.vault.theft');
          }
          if (vault.status === VaultStatusExt.Liquidated) {
            statusText = t('dashboard.vault.liquidated');
          }
          if (settledCollateralization) {
            if (settledCollateralization.lt(theLiquidationThreshold)) {
              statusText = t('dashboard.vault.liquidation');
            }
            if (settledCollateralization.lt(theSecureCollateralThreshold)) {
              statusText = t('dashboard.vault.undercollateralized');
            }
          }
          if (vault.bannedUntil) {
            statusText = t('dashboard.vault.banned_until', { blockHeight: bannedUntil });
          }
          if (vault.status === VaultStatusExt.Inactive) {
            statusText = t('dashboard.vault.inactive');
          }
          statusText = t('dashboard.vault.active');

          theVaults.push({
            vaultId: shortAddress(vault.id.toString()),
            // TODO: fetch collateral reserved
            lockedBTC: settledTokens.toHuman(),
            lockedDOT: vaultCollateral.toHuman(),
            pendingBTC: unsettledTokens.toHuman(),
            btcAddress,
            status: statusText,
            unsettledCollateralization: unsettledCollateralization?.toString(),
            settledCollateralization: settledCollateralization?.toString()
          });
        }
        setVaults(theVaults);
      } catch (error) {
        console.log('[VaultTable] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    t
  ]);

  const columns = React.useMemo(
    () => [
      {
        Header: t('account_id'),
        accessor: 'vaultId',
        classNames: [
          'text-left'
        ]
      },
      {
        Header: t('locked_dot'),
        accessor: 'lockedDOT',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('locked_btc'),
        accessor: 'lockedBTC',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('pending_btc'),
        accessor: 'pendingBTC',
        classNames: [
          'text-right'
        ],
        tooltip: t('vault.tip_pending_btc')
      },
      {
        Header: t('collateralization'),
        accessor: '',
        classNames: [
          'text-left'
        ],
        tooltip: t('vault.tip_collateralization'),
        Cell: function FormattedCell(props: any) {
          if (
            props.row.original.unsettledCollateralization === undefined &&
            props.row.original.settledCollateralization === undefined
          ) {
            return (
              <span>∞</span>
            );
          } else {
            return (
              <div>
                <p
                  className={getCollateralizationColor(
                    props.row.original.settledCollateralization,
                    secureCollateralThreshold
                  )}>
                  {props.row.original.settledCollateralization === undefined ?
                    '∞' :
                    roundTwoDecimals(props.row.original.settledCollateralization.toString()) + '%'}
                </p>
                <p className='text-xs'>
                  <span>{t('vault.pending_table_subcell')}</span>
                  <span
                    className={getCollateralizationColor(
                      props.row.original.unsettledCollateralization,
                      secureCollateralThreshold
                    )}>
                    {props.row.original.unsettledCollateralization === undefined ?
                      '∞' :
                      roundTwoDecimals(props.row.original.unsettledCollateralization.toString()) + '%'}
                  </span>
                </p>
              </div>
            );
          }
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }) {
          let statusClassName;
          if (value === constants.VAULT_STATUS_ACTIVE) {
            statusClassName = clsx(
              'text-interlayConifer',
              'font-medium'
            );
          }
          if (value === constants.VAULT_STATUS_UNDER_COLLATERALIZED) {
            statusClassName = clsx(
              'text-interlayCalifornia',
              'font-medium'
            );
          }
          if (
            value === constants.VAULT_STATUS_THEFT ||
            value === constants.VAULT_STATUS_AUCTION ||
            value === constants.VAULT_STATUS_LIQUIDATED
          ) {
            statusClassName = clsx(
              'text-interlayCinnabar',
              'font-medium'
            );
          }

          return (
            <span className={statusClassName}>{value}</span>
          );
        }
      }
    ],
    [
      t,
      secureCollateralThreshold
    ]
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
      data: vaults
    }
  );

  return (
    <InterlayTableContainer className='space-y-6'>
      <h2
        className={clsx(
          'text-2xl',
          'font-medium'
        )}>
        {t('dashboard.vault.active_vaults')}
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
                  {column.tooltip && (
                    <InterlayTooltip label={column.tooltip}>
                      <InformationCircleIcon
                        className={clsx(
                          'text-textSecondary',
                          'inline-block',
                          'ml-1',
                          'w-5',
                          'h-5'
                        )} />
                    </InterlayTooltip>
                  )}
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

export default VaultTable;
