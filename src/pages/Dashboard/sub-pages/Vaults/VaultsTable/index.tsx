
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
  VaultExt
} from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import SectionTitle from 'parts/SectionTitle';
import ErrorFallback from 'components/ErrorFallback';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import InformationTooltip from 'components/tooltips/InformationTooltip';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import {
  COLLATERAL_TOKEN,
  COLLATERAL_TOKEN_SYMBOL
} from 'config/relay-chains';
import {
  getCollateralization,
  getVaultStatusLabel
} from 'utils/helpers/vaults';
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
import { BTCToCollateralTokenRate } from 'types/currency.d';
import { StoreType } from 'common/types/util.types';

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
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'system',
      'getCurrentActiveBlockNumber'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(currentActiveBlockNumberError);

  const {
    isIdle: secureCollateralThresholdIdle,
    isLoading: secureCollateralThresholdLoading,
    data: secureCollateralThreshold,
    error: secureCollateralThresholdError
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
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
    isIdle: btcToCollateralTokenRateIdle,
    isLoading: btcToCollateralTokenRateLoading,
    data: btcToCollateralTokenRate,
    error: btcToCollateralTokenRateError
  } = useQuery<
    BTCToCollateralTokenRate,
    Error
  >(
    [
      GENERIC_FETCHER,
      'oracle',
      'getExchangeRate',
      COLLATERAL_TOKEN
    ],
    genericFetcher<BTCToCollateralTokenRate>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(btcToCollateralTokenRateError);

  const {
    isIdle: vaultsExtIdle,
    isLoading: vaultsExtLoading,
    data: vaultsExt,
    error: vaultsExtError
  } = useQuery<Array<VaultExt<BitcoinUnit>>, Error>(
    [
      GENERIC_FETCHER,
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
          let statusClasses;
          if (value === constants.VAULT_STATUS_ACTIVE) {
            statusClasses = clsx(
              'text-interlayConifer',
              'font-medium'
            );
          }
          if (value === constants.VAULT_STATUS_UNDER_COLLATERALIZED) {
            statusClasses = clsx(
              'text-interlayCalifornia',
              'font-medium'
            );
          }
          if (
            value === constants.VAULT_STATUS_THEFT ||
            value === constants.VAULT_STATUS_LIQUIDATED
          ) {
            statusClasses = clsx(
              'text-interlayCinnabar',
              'font-medium'
            );
          }

          return (
            <span className={statusClasses}>{value}</span>
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
    btcToCollateralTokenRate &&
    liquidationThreshold &&
    secureCollateralThreshold &&
    currentActiveBlockNumber
  ) {
    for (const vaultExt of vaultsExt) {
      const statusLabel = getVaultStatusLabel(
        vaultExt,
        currentActiveBlockNumber,
        liquidationThreshold,
        secureCollateralThreshold,
        btcToCollateralTokenRate,
        t
      );

      const vaultCollateral = vaultExt.backingCollateral;
      const settledTokens = vaultExt.issuedTokens;
      const settledCollateralization = getCollateralization(vaultCollateral, settledTokens, btcToCollateralTokenRate);
      const btcAddress = vaultExt.wallet.publicKey; // TODO: get address(es)?
      const unsettledTokens = vaultExt.toBeIssuedTokens;
      const unsettledCollateralization =
        getCollateralization(vaultCollateral, unsettledTokens.add(settledTokens), btcToCollateralTokenRate);

      vaults.push({
        vaultId: vaultExt.id.accountId.toString(),
        // TODO: fetch collateral reserved
        lockedBTC: displayMonetaryAmount(settledTokens),
        lockedDOT: displayMonetaryAmount(vaultCollateral),
        pendingBTC: displayMonetaryAmount(unsettledTokens),
        btcAddress,
        status: statusLabel,
        unsettledCollateralization: unsettledCollateralization?.toString(),
        settledCollateralization: settledCollateralization?.toString()
      });
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
      currentActiveBlockNumberIdle ||
      currentActiveBlockNumberLoading ||
      secureCollateralThresholdIdle ||
      secureCollateralThresholdLoading ||
      liquidationThresholdIdle ||
      liquidationThresholdLoading ||
      btcToCollateralTokenRateIdle ||
      btcToCollateralTokenRateLoading ||
      vaultsExtIdle ||
      vaultsExtLoading
    ) {
      return (
        <PrimaryColorEllipsisLoader />
      );
    }

    const handleRowClick = (vaultId: string) => () => {
      history.push(PAGES.VAULT.replace(`:${URL_PARAMETERS.VAULT_ACCOUNT_ADDRESS}`, vaultId));
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
                    <InformationTooltip
                      className={clsx(
                        'inline-block',
                        'ml-1'
                      )}
                      label={column.tooltip} />
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
