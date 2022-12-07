import { VaultExt } from '@interlay/interbtc-api';
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
import { displayMonetaryAmount, formatPercentage } from '@/common/utils/utils';
import AddressWithCopyUI from '@/components/AddressWithCopyUI';
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
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import * as constants from '@/constants';
import SectionTitle from '@/parts/SectionTitle';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import { PAGES, URL_PARAMETERS } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';
import { getCollateralization, getVaultStatusLabel } from '@/utils/helpers/vaults';
import { useGetCollateralCurrenciesData } from '@/utils/hooks/api/use-get-collateral-currencies-data';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetIdentities } from '@/utils/hooks/api/use-get-identities';

interface CollateralizationCellProps {
  settledCollateralization: Big | undefined;
  unsettledCollateralization: Big | undefined;
  collateralSecureThreshold: Big;
  collateralPremiumThreshold: Big;
}

const CollateralizationCell = ({
  settledCollateralization,
  unsettledCollateralization,
  collateralSecureThreshold,
  collateralPremiumThreshold
}: CollateralizationCellProps) => {
  const { t } = useTranslation();

  if (unsettledCollateralization === undefined && settledCollateralization === undefined) {
    return <span>∞</span>;
  } else {
    return (
      <>
        <div>
          <p
            className={getCollateralizationColor(
              settledCollateralization,
              collateralSecureThreshold,
              collateralPremiumThreshold
            )}
          >
            {settledCollateralization === undefined
              ? '∞'
              : formatPercentage(settledCollateralization.mul(100).toNumber())}
          </p>
          <p className='text-xs'>
            <span>{t('vault.pending_table_subcell')}</span>
            <span
              className={getCollateralizationColor(
                unsettledCollateralization,
                collateralSecureThreshold,
                collateralPremiumThreshold
              )}
            >
              {unsettledCollateralization === undefined
                ? '∞'
                : formatPercentage(unsettledCollateralization.mul(100).toNumber())}
            </span>
          </p>
        </div>
      </>
    );
  }
};

const getCollateralizationColor = (
  collateralization: Big | undefined,
  collateralSecureThreshold: Big,
  collateralPremiumThreshold: Big
): string | undefined => {
  if (collateralization === undefined) return undefined;

  if (collateralization.gte(collateralSecureThreshold)) {
    return clsx(getColorShade('green'), 'font-medium');
  } else if (collateralization.gte(collateralPremiumThreshold)) {
    // Below premium redeem threshold
    return clsx(getColorShade('yellow'), 'font-medium');
  } else {
    // Liquidation
    return clsx(getColorShade('red'), 'font-medium');
  }
};

enum Accessor {
  VaultId = 'vaultId',
  Collateral = 'collateral',
  Identity = 'identity',
  LockedCollateralTokenAmount = 'lockedCollateralTokenAmount',
  LockedBTCAmount = 'lockedBTCAmount',
  PendingBTCAmount = 'pendingBTCAmount',
  CollateralizationUI = 'collateralizationUI',
  Status = 'status'
}

interface Vault {
  [Accessor.VaultId]: string;
  [Accessor.Collateral]: string;
  [Accessor.Identity]: string | undefined;
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
    isIdle: collateralCurrenciesDataIdle,
    isLoading: collateralCurrenciesDataLoading,
    data: collateralCurrenciesData,
    error: collateralCurrenciesDataError
  } = useGetCollateralCurrenciesData(bridgeLoaded);
  useErrorHandler(collateralCurrenciesDataError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  const {
    isIdle: currenciesIdle,
    isLoading: currenciesLoading,
    error: currenciesError,
    getCurrencyFromIdPrimitive
  } = useGetCurrencies(bridgeLoaded);
  useErrorHandler(currenciesError);

  const { isIdle: vaultsExtIdle, isLoading: vaultsExtLoading, data: vaultsExt, error: vaultsExtError } = useQuery<
    Array<VaultExt>,
    Error
  >([GENERIC_FETCHER, 'vaults', 'list'], genericFetcher<Array<VaultExt>>(), {
    enabled: !!bridgeLoaded
  });
  useErrorHandler(vaultsExtError);

  const {
    isIdle: identitiesIdle,
    isLoading: identitiesLoading,
    data: identities,
    error: identitiesError
  } = useGetIdentities(bridgeLoaded);
  useErrorHandler(identitiesError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('account_id'),
        accessor: Accessor.VaultId,
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <AddressWithCopyUI address={value} />;
        }
      },
      {
        Header: t('identity'),
        accessor: Accessor.Identity,
        classNames: ['text-left']
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
          return value.toHuman(8);
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

  const vaults: Array<Vault> | undefined = React.useMemo(() => {
    if (
      vaultsExt &&
      collateralCurrenciesData &&
      currentActiveBlockNumber &&
      !currenciesIdle &&
      !currenciesLoading &&
      identities
    ) {
      const rawVaults = vaultsExt.map((vaultExt) => {
        const collateral = vaultExt.id.currencies.collateral;
        const collateralTokenSymbol = getCurrencyFromIdPrimitive(collateral).ticker;

        const collateralLiquidationThreshold = collateralCurrenciesData[collateralTokenSymbol].liquidationThreshold;
        const collateralSecureThreshold = collateralCurrenciesData[collateralTokenSymbol].secureThreshold;
        const collateralPremiumThreshold = collateralCurrenciesData[collateralTokenSymbol].premiumThreshold;
        const btcToCollateralTokenRate = collateralCurrenciesData[collateralTokenSymbol].exchangeRate;
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
        const settledCollateralization = getCollateralization(vaultCollateral, settledTokens, btcToCollateralTokenRate);
        const unsettledTokens = vaultExt.toBeIssuedTokens;
        const unsettledCollateralization = getCollateralization(
          vaultCollateral,
          unsettledTokens.add(settledTokens),
          btcToCollateralTokenRate
        );

        const identity = identities.get(vaultExt.id.accountId.toString());

        return {
          [Accessor.VaultId]: vaultExt.id.accountId.toString(),
          [Accessor.Collateral]: collateralTokenSymbol,
          [Accessor.Identity]: identity,
          // TODO: fetch collateral reserved
          [Accessor.LockedCollateralTokenAmount]: `${displayMonetaryAmount(vaultCollateral)} ${collateralTokenSymbol}`,
          [Accessor.LockedBTCAmount]: settledTokens,
          [Accessor.PendingBTCAmount]: displayMonetaryAmount(unsettledTokens),
          [Accessor.CollateralizationUI]: (
            <CollateralizationCell
              settledCollateralization={settledCollateralization}
              unsettledCollateralization={unsettledCollateralization}
              collateralSecureThreshold={collateralSecureThreshold}
              collateralPremiumThreshold={collateralPremiumThreshold}
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
    collateralCurrenciesData,
    t,
    vaultsExt,
    currenciesIdle,
    currenciesLoading,
    getCurrencyFromIdPrimitive,
    identities
  ]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: vaults ?? []
  });

  const renderTable = () => {
    if (
      currentActiveBlockNumberIdle ||
      currentActiveBlockNumberLoading ||
      collateralCurrenciesDataIdle ||
      collateralCurrenciesDataLoading ||
      vaultsExtIdle ||
      vaultsExtLoading ||
      identitiesIdle ||
      identitiesLoading
    ) {
      return <PrimaryColorEllipsisLoader />;
    }

    const handleRowClick = (vaultId: string, collateralToken: string) => () => {
      const vault = PAGES.VAULT.replace(`:${URL_PARAMETERS.VAULT.ACCOUNT}`, vaultId)
        .replace(`:${URL_PARAMETERS.VAULT.COLLATERAL}`, collateralToken)
        .replace(`:${URL_PARAMETERS.VAULT.WRAPPED}`, WRAPPED_TOKEN_SYMBOL);

      history.push(vault);
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
                onClick={handleRowClick(row.original[Accessor.VaultId], row.original[Accessor.Collateral])}
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
