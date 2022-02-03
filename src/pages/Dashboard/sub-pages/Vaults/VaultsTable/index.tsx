
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
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
import InterlayTooltip from 'components/UI/InterlayTooltip';
import {
  COLLATERAL_TOKEN,
  COLLATERAL_TOKEN_SYMBOL
} from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  PAGES,
  URL_PARAMETERS
} from 'utils/constants/links';
import {
  shortAddress,
  displayMonetaryAmount
} from 'common/utils/utils';
import * as constants from '../../../../../constants';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';
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
): string | undefined => {
  if (collateralization === undefined) return undefined;

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

interface Vault {
  vaultId: string;
  lockedBTC: string;
  lockedDOT: string;
  pendingBTC: string;
  btcAddress: string;
  status: string;
  unsettledCollateralization: string | undefined;
  settledCollateralization: string | undefined;
}

const VaultsTable = (): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const history = useHistory();

  const {
    isIdle: parachainHeightIdle,
    isLoading: parachainHeightLoading,
    data: parachainHeight,
    error: parachainHeightError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'system',
      'getCurrentActiveBlockNumber'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(parachainHeightError);

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
  } = useQuery<Array<VaultExt<BitcoinUnit>>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'vaults',
      'list'
    ],
    genericFetcher<Array<VaultExt<BitcoinUnit>>>(),
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
        ],
        Cell: function FormattedCell({ value }: { value: string; }) {
          return (
            <>{shortAddress(value)}</>
          );
        }
      },
      {
        Header: t('locked_dot', {
          collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
        }),
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
        Cell: function FormattedCell({ row: { original } }: { row: { original: Vault; }; }) {
          if (
            original.unsettledCollateralization === undefined &&
            original.settledCollateralization === undefined
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
                        original.settledCollateralization,
                        secureCollateralThreshold
                      )}>
                      {original.settledCollateralization === undefined ?
                        '∞' :
                        roundTwoDecimals(original.settledCollateralization.toString()) + '%'}
                    </p>
                    <p className='text-xs'>
                      <span>{t('vault.pending_table_subcell')}</span>
                      <span
                        className={getCollateralizationColor(
                          original.unsettledCollateralization,
                          secureCollateralThreshold
                        )}>
                        {original.unsettledCollateralization === undefined ?
                          '∞' :
                          roundTwoDecimals(original.unsettledCollateralization.toString()) + '%'}
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
        Cell: function FormattedCell({ value }: { value: string; }) {
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

  const vaults: Array<Vault> = [];
  if (
    vaultsExt &&
    btcToDOTRate &&
    liquidationThreshold &&
    secureCollateralThreshold &&
    parachainHeight
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
      if (settledCollateralization) {
        if (settledCollateralization.lt(liquidationThreshold)) {
          statusText = t('dashboard.vault.liquidation');
        }
        if (settledCollateralization.lt(secureCollateralThreshold)) {
          statusText = t('dashboard.vault.undercollateralized');
        }
      }
      // Should only display bannedUntil status if the bannedUntil block < current parachain block
      // Otherwise, should not show this status.
      if (vaultExt.bannedUntil && parachainHeight < vaultExt.bannedUntil) {
        statusText = t('dashboard.vault.banned_until', { blockHeight: vaultExt.bannedUntil });
      }
      if (vaultExt.status === VaultStatusExt.Inactive) {
        statusText = t('dashboard.vault.inactive');
      }
      if (vaultExt.status === VaultStatusExt.CommittedTheft) {
        statusText = t('dashboard.vault.theft');
      }
      if (vaultExt.status === VaultStatusExt.Liquidated) {
        statusText = t('dashboard.vault.liquidated');
      }
      // Default to active, but do not overwrite
      if (!statusText) {
        statusText = t('dashboard.vault.active');
      }

      vaults.push({
        vaultId: vaultExt.id.accountId.toString(),
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
      parachainHeightIdle ||
      parachainHeightLoading ||
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
        <PrimaryColorEllipsisLoader />
      );
    }

    const handleRowClick = (vaultId: string) => () => {
      history.push(PAGES.VAULT.replace(`:${URL_PARAMETERS.VAULT_ADDRESS}`, vaultId));
    };

    return (
      <InterlayTable {...getTableProps()}>
        <InterlayThead>
          {/* TODO: should type properly */}
          {headerGroups.map((headerGroup: any) => (
            // eslint-disable-next-line react/jsx-key
            <InterlayTr {...headerGroup.getHeaderGroupProps()}>
              {/* TODO: should type properly */}
              {headerGroup.headers.map((column: any) => (
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
                          // eslint-disable-next-line max-len
                          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                          // eslint-disable-next-line max-len
                          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
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
          {/* TODO: should type properly */}
          {rows.map((row: any) => {
            prepareRow(row);

            const {
              key,
              className: rowClassName,
              ...restRowProps
            } = row.getRowProps();

            return (
              <InterlayTr
                key={key}
                className={clsx(
                  rowClassName,
                  'cursor-pointer'
                )}
                {...restRowProps}
                onClick={handleRowClick(row.original.vaultId)}>
                {/* TODO: should type properly */}
                {row.cells.map((cell: any) => {
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

  // TODO: should add pagination
  return (
    <InterlayTableContainer className='space-y-6'>
      <SectionTitle>
        {t('dashboard.vault.active_vaults')}
      </SectionTitle>
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
