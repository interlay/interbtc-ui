import { CollateralIdLiteral, currencyIdToMonetaryCurrency, isCurrencyEqual, VaultExt } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTable } from 'react-table';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, formatPercentage, shortAddress } from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import InformationTooltip from '@/components/tooltips/InformationTooltip';
import InterlayTable, {
  InterlayTableContainer,
  InterlayTbody,
  InterlayTd,
  InterlayTh,
  InterlayThead,
  InterlayTr
} from '@/components/UI/InterlayTable';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL
} from '@/config/relay-chains';
import { VAULT_COLLATERAL_TOKENS } from '@/config/vaults';
import * as constants from '@/constants';
import SectionTitle from '@/parts/SectionTitle';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import { BTCToCollateralTokenRate } from '@/types/currency';
import { PAGES, URL_PARAMETERS } from '@/utils/constants/links';
import asyncFilter from '@/utils/helpers/async-filter';
import { getColorShade } from '@/utils/helpers/colors';
import { getCollateralization, getVaultStatusLabel } from '@/utils/helpers/vaults';
import { useGetCollateralThresholds } from '@/utils/hooks/api/use-get-collateral-thresholds';

interface CollateralizationCellProps {
  settledCollateralization: Big | undefined;
  unsettledCollateralization: Big | undefined;
  collateralSecureThreshold: Big;
}

const CollateralizationCell = ({
  settledCollateralization,
  unsettledCollateralization,
  collateralSecureThreshold
}: CollateralizationCellProps) => {
  const { t } = useTranslation();

  if (unsettledCollateralization === undefined && settledCollateralization === undefined) {
    return <span>∞</span>;
  } else {
    return (
      <>
        <div>
          <p className={getCollateralizationColor(settledCollateralization, collateralSecureThreshold)}>
            {settledCollateralization === undefined ? '∞' : formatPercentage(settledCollateralization.toNumber())}
          </p>
          <p className='text-xs'>
            <span>{t('vault.pending_table_subcell')}</span>
            <span className={getCollateralizationColor(unsettledCollateralization, collateralSecureThreshold)}>
              {unsettledCollateralization === undefined ? '∞' : formatPercentage(unsettledCollateralization.toNumber())}
            </span>
          </p>
        </div>
      </>
    );
  }
};

const getCollateralizationColor = (
  collateralization: Big | undefined,
  collateralSecureThreshold: Big
): string | undefined => {
  if (collateralization === undefined) return undefined;

  if (collateralization.gte(collateralSecureThreshold)) {
    return clsx(getColorShade('green'), 'font-medium');
  } else {
    // Liquidation
    return clsx(getColorShade('red'), 'font-medium');
  }
};

enum Accessor {
  VaultId = 'vaultId',
  Collateral = 'collateral',
  LockedCollateralTokenAmount = 'lockedCollateralTokenAmount',
  LockedBTCAmount = 'lockedBTCAmount',
  PendingBTCAmount = 'pendingBTCAmount',
  CollateralizationUI = 'collateralizationUI',
  Status = 'status'
}

interface Vault {
  [Accessor.VaultId]: string;
  [Accessor.LockedCollateralTokenAmount]: string;
  [Accessor.LockedBTCAmount]: BitcoinAmount;
  [Accessor.PendingBTCAmount]: string;
  [Accessor.CollateralizationUI]: React.ReactNode;
  [Accessor.Status]: string;
}

const VaultsTable = (): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const history = useHistory();

  const {
    isIdle: collateralThresholdsIdle,
    isLoading: collateralThresholdsLoading,
    data: collateralThresholds,
    error: collateralThresholdsError
  } = useGetCollateralThresholds(bridgeLoaded);
  useErrorHandler(collateralThresholdsError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  const {
    isIdle: btcToRelayChainNativeTokenRateIdle,
    isLoading: btcToRelayChainNativeTokenRateLoading,
    data: btcToRelayChainNativeTokenRate,
    error: btcToRelayChainNativeTokenRateError
  } = useQuery<BTCToCollateralTokenRate, Error>(
    [GENERIC_FETCHER, 'oracle', 'getExchangeRate', RELAY_CHAIN_NATIVE_TOKEN],
    genericFetcher<BTCToCollateralTokenRate>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(btcToRelayChainNativeTokenRateError);

  const {
    isIdle: btcToGovernanceTokenRateIdle,
    isLoading: btcToGovernanceTokenRateLoading,
    data: btcToGovernanceTokenRate,
    error: btcToGovernanceTokenRateError
  } = useQuery<BTCToCollateralTokenRate, Error>(
    [GENERIC_FETCHER, 'oracle', 'getExchangeRate', GOVERNANCE_TOKEN],
    genericFetcher<BTCToCollateralTokenRate>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(btcToGovernanceTokenRateError);

  const { isIdle: vaultsExtIdle, isLoading: vaultsExtLoading, data: vaultsExt, error: vaultsExtError } = useQuery<
    Array<VaultExt>,
    Error
  >([GENERIC_FETCHER, 'vaults', 'list'], genericFetcher<Array<VaultExt>>(), {
    enabled: !!bridgeLoaded
  });
  useErrorHandler(vaultsExtError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('account_id'),
        accessor: Accessor.VaultId,
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <>{shortAddress(value)}</>;
        }
      },
      {
        Header: t('collateral'),
        accessor: Accessor.Collateral,
        classNames: ['text-center']
      },
      {
        Header: t('locked_collateral'),
        accessor: Accessor.LockedCollateralTokenAmount,
        classNames: ['text-right']
      },
      {
        Header: t('locked_btc'),
        accessor: Accessor.LockedBTCAmount,
        classNames: ['text-right'],
        Cell: function FormattedCell({ value }: { value: BitcoinAmount }) {
          return displayMonetaryAmount(value);
        }
      },
      {
        Header: t('pending_btc'),
        accessor: Accessor.PendingBTCAmount,
        classNames: ['text-right'],
        tooltip: t('vault.tip_pending_btc')
      },
      {
        Header: t('collateralization'),
        accessor: Accessor.CollateralizationUI,
        classNames: ['text-left'],
        tooltip: t('vault.tip_collateralization')
      },
      {
        Header: t('status'),
        accessor: Accessor.Status,
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: string }) {
          let statusClasses;
          if (value === constants.VAULT_STATUS_ACTIVE) {
            statusClasses = clsx(getColorShade('green'), 'font-medium');
          }
          if (value === constants.VAULT_STATUS_UNDER_COLLATERALIZED) {
            statusClasses = clsx(getColorShade('yellow'), 'font-medium');
          }
          if (value === constants.VAULT_STATUS_THEFT || value === constants.VAULT_STATUS_LIQUIDATED) {
            statusClasses = clsx(getColorShade('red'), 'font-medium');
          }

          return <span className={statusClasses}>{value}</span>;
        }
      }
    ],
    [t]
  );

  const [filteredVaults, setFilteredVaults] = React.useState<Array<VaultExt>>([]);
  const handleError = useErrorHandler();
  React.useEffect(() => {
    if (!vaultsExt) return;
    if (!handleError) return;

    (async () => {
      try {
        const theFilteredVaults = await asyncFilter<VaultExt>(vaultsExt, async (vaultExt: VaultExt) =>
          VAULT_COLLATERAL_TOKENS.some(async (item) => {
            const collateralToken = await currencyIdToMonetaryCurrency(
              window.bridge.assetRegistry,
              vaultExt.id.currencies.collateral
            );
            const isEqual = isCurrencyEqual(item, collateralToken);

            return isEqual;
          })
        );

        setFilteredVaults(theFilteredVaults);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [vaultsExt, handleError]);

  const vaults: Array<Vault> | undefined = React.useMemo(() => {
    if (
      filteredVaults &&
      btcToRelayChainNativeTokenRate &&
      btcToGovernanceTokenRate &&
      collateralThresholds &&
      currentActiveBlockNumber
    ) {
      const rawVaults = filteredVaults
        .filter((vaultExt) => {
          if (vaultExt.id.currencies.collateral.isToken) {
            return true;
          }
          console.warn('Unsupported non token collateral vault found and removed from vaults list');
          return false;
        })
        .map((vaultExt) => {
          const collateral = vaultExt.id.currencies.collateral;
          const collateralTokenSymbol = collateral.asToken.type as CollateralIdLiteral;

          const collateralLiquidationThreshold = collateralThresholds[collateralTokenSymbol].liquidationThreshold;
          const collateralSecureThreshold = collateralThresholds[collateralTokenSymbol].secureThreshold;
          let btcToCollateralTokenRate: BTCToCollateralTokenRate;
          switch (collateralTokenSymbol) {
            case RELAY_CHAIN_NATIVE_TOKEN_SYMBOL: {
              btcToCollateralTokenRate = btcToRelayChainNativeTokenRate;
              break;
            }
            case GOVERNANCE_TOKEN_SYMBOL: {
              btcToCollateralTokenRate = btcToGovernanceTokenRate;
              break;
            }
            default:
              throw new Error('Something went wrong with collateralTokenType!');
          }

          const statusLabel = getVaultStatusLabel(
            vaultExt,
            currentActiveBlockNumber,
            collateralLiquidationThreshold,
            collateralSecureThreshold,
            btcToCollateralTokenRate,
            t
          );

          const vaultCollateral = vaultExt.backingCollateral;
          const settledTokens = vaultExt.issuedTokens;
          const settledCollateralization = getCollateralization(
            vaultCollateral,
            settledTokens,
            btcToCollateralTokenRate
          );
          const unsettledTokens = vaultExt.toBeIssuedTokens;
          const unsettledCollateralization = getCollateralization(
            vaultCollateral,
            unsettledTokens.add(settledTokens),
            btcToCollateralTokenRate
          );

          return {
            [Accessor.VaultId]: vaultExt.id.accountId.toString(),
            [Accessor.Collateral]: collateralTokenSymbol,
            // TODO: fetch collateral reserved
            [Accessor.LockedCollateralTokenAmount]: `${displayMonetaryAmount(
              vaultCollateral
            )} ${collateralTokenSymbol}`,
            [Accessor.LockedBTCAmount]: settledTokens,
            [Accessor.PendingBTCAmount]: displayMonetaryAmount(unsettledTokens),
            [Accessor.CollateralizationUI]: (
              <CollateralizationCell
                settledCollateralization={settledCollateralization}
                unsettledCollateralization={unsettledCollateralization}
                collateralSecureThreshold={collateralSecureThreshold}
              />
            ),
            [Accessor.Status]: statusLabel
          };
        });

      const sortedVaults = rawVaults.sort((vaultA, vaultB) => {
        const vaultALockedBTC = vaultA[Accessor.LockedBTCAmount];
        const vaultBLockedBTC = vaultB[Accessor.LockedBTCAmount];
        return vaultBLockedBTC.gt(vaultALockedBTC) ? 1 : vaultALockedBTC.gt(vaultBLockedBTC) ? -1 : 0;
      });

      return sortedVaults;
    }
  }, [
    currentActiveBlockNumber,
    btcToRelayChainNativeTokenRate,
    btcToGovernanceTokenRate,
    collateralThresholds,
    t,
    filteredVaults
  ]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: vaults ?? []
  });

  const renderTable = () => {
    if (
      currentActiveBlockNumberIdle ||
      currentActiveBlockNumberLoading ||
      collateralThresholdsIdle ||
      collateralThresholdsLoading ||
      btcToRelayChainNativeTokenRateIdle ||
      btcToRelayChainNativeTokenRateLoading ||
      btcToGovernanceTokenRateIdle ||
      btcToGovernanceTokenRateLoading ||
      vaultsExtIdle ||
      vaultsExtLoading
    ) {
      return <PrimaryColorEllipsisLoader />;
    }

    const handleRowClick = (vaultId: string) => () => {
      history.push(PAGES.VAULTS.replace(`:${URL_PARAMETERS.VAULT.ACCOUNT}`, vaultId));
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
                  ])}
                >
                  {column.render('Header')}
                  {column.tooltip && (
                    <InformationTooltip className={clsx('inline-block', 'ml-1')} label={column.tooltip} />
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

            const { key, className: rowClassName, ...restRowProps } = row.getRowProps();

            return (
              <InterlayTr
                key={key}
                className={clsx(rowClassName, 'cursor-pointer')}
                {...restRowProps}
                onClick={handleRowClick(row.original[Accessor.VaultId])}
              >
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
                      ])}
                    >
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

  return (
    <InterlayTableContainer className='space-y-6'>
      <SectionTitle>{t('dashboard.vault.vaults')}</SectionTitle>
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
