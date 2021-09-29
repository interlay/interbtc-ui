
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import Big from 'big.js';
import clsx from 'clsx';
import {
  roundTwoDecimals,
  VaultExt,
  VaultStatusExt,
  CollateralUnit
} from '@interlay/interbtc-api';
import {
  Bitcoin,
  BitcoinAmount,
  BitcoinUnit,
  ExchangeRate,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';

import ErrorFallback from 'components/ErrorFallback';
import EllipsisLoader from 'components/EllipsisLoader';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import InterlayTooltip from 'components/UI/InterlayTooltip';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import {
  shortAddress,
  displayMonetaryAmount
} from 'common/utils/utils';
import * as constants from '../../../../constants';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';
import { Vault } from 'common/types/vault.types';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

const getCollateralization = (
  collateral: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>,
  tokens: BitcoinAmount,
  btcToDOTRate:
    ExchangeRate<
      Bitcoin,
      BitcoinUnit,
      Currency<CollateralUnit>,
      CollateralUnit
    >
) => {
  if (tokens.gt(BitcoinAmount.zero) && btcToDOTRate.toBig().gt(0)) {
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

const VaultsTable = (): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: secureCollateralThresholdIdle,
    isLoading: secureCollateralThresholdLoading,
    data: secureCollateralThreshold,
    error: secureCollateralThresholdError
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'vaults',
      'getSecureCollateralThreshold',
      COLLATERAL_TOKEN
    ],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(secureCollateralThresholdError);

  const {
    isIdle: liquidationThresholdIdle,
    isLoading: liquidationThresholdLoading,
    data: liquidationThreshold,
    error: liquidationThresholdError
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'vaults',
      'getLiquidationCollateralThreshold',
      COLLATERAL_TOKEN
    ],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(liquidationThresholdError);

  const {
    isIdle: btcToDOTRateIdle,
    isLoading: btcToDOTRateLoading,
    data: btcToDOTRate,
    error: btcToDOTRateError
  } = useQuery<
    ExchangeRate<
      Bitcoin,
      BitcoinUnit,
      Currency<CollateralUnit>,
      CollateralUnit
    >,
    Error
  >(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'oracle',
      'getExchangeRate',
      COLLATERAL_TOKEN
    ],
    genericFetcher<
      ExchangeRate<
        Bitcoin,
        BitcoinUnit,
        Currency<CollateralUnit>,
        CollateralUnit
      >
    >(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(btcToDOTRateError);

  const {
    isIdle: vaultsExtIdle,
    isLoading: vaultsExtLoading,
    data: vaultsExt,
    error: vaultsExtError
  } = useQuery<Array<VaultExt>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'vaults',
      'list'
    ],
    genericFetcher<Array<VaultExt>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(vaultsExtError);

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
              <>
                {secureCollateralThreshold && (
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
                )}
              </>
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

  const vaults: Vault[] = [];
  if (
    vaultsExt &&
    btcToDOTRate &&
    liquidationThreshold &&
    secureCollateralThreshold
  ) {
    for (const vaultExt of vaultsExt) {
      const vaultCollateral = vaultExt.backingCollateral;
      const unsettledTokens = vaultExt.toBeIssuedTokens;
      const settledTokens = vaultExt.issuedTokens;
      const unsettledCollateralization =
        getCollateralization(vaultCollateral, unsettledTokens.add(settledTokens), btcToDOTRate);
      const settledCollateralization = getCollateralization(vaultCollateral, settledTokens, btcToDOTRate);

      const btcAddress = vaultExt.wallet.publicKey; // TODO: get address(es)?

      // ray test touch <
      // TODO: format via `FormattedCell`
      let statusText;
      if (vaultExt.status === VaultStatusExt.CommittedTheft) {
        statusText = t('dashboard.vault.theft');
      }
      if (vaultExt.status === VaultStatusExt.Liquidated) {
        statusText = t('dashboard.vault.liquidated');
      }
      if (settledCollateralization) {
        if (settledCollateralization.lt(liquidationThreshold)) {
          statusText = t('dashboard.vault.liquidation');
        }
        if (settledCollateralization.lt(secureCollateralThreshold)) {
          statusText = t('dashboard.vault.undercollateralized');
        }
      }
      if (vaultExt.bannedUntil) {
        statusText = t('dashboard.vault.banned_until', { blockHeight: bannedUntil });
      }
      if (vaultExt.status === VaultStatusExt.Inactive) {
        statusText = t('dashboard.vault.inactive');
      }
      statusText = t('dashboard.vault.active');

      vaults.push({
        vaultId: shortAddress(vaultExt.id.toString()),
        // TODO: fetch collateral reserved
        lockedBTC: displayMonetaryAmount(settledTokens),
        lockedDOT: displayMonetaryAmount(vaultCollateral),
        pendingBTC: displayMonetaryAmount(unsettledTokens),
        btcAddress,
        status: statusText,
        unsettledCollateralization: unsettledCollateralization?.toString(),
        settledCollateralization: settledCollateralization?.toString()
      });
      // ray test touch >
    }
  }

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

  const renderTable = () => {
    if (
      secureCollateralThresholdIdle ||
      secureCollateralThresholdLoading ||
      liquidationThresholdIdle ||
      liquidationThresholdLoading ||
      btcToDOTRateIdle ||
      btcToDOTRateLoading ||
      vaultsExtIdle ||
      vaultsExtLoading
    ) {
      return (
        <div
          className={clsx(
            'flex',
            'justify-center'
          )}>
          <EllipsisLoader dotClassName='bg-interlayCalifornia-400' />
        </div>
      );
    }

    return (
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
    );
  };

  // ray test touch <
  // TODO: should add pagination
  // ray test touch >
  return (
    <InterlayTableContainer className='space-y-6'>
      <h2
        className={clsx(
          'text-2xl',
          'font-medium'
        )}>
        {t('dashboard.vault.active_vaults')}
      </h2>
      {renderTable()}
    </InterlayTableContainer>
  );
};

export default withErrorBoundary(VaultsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
