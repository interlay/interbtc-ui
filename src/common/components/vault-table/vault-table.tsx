
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// ray test touch <<
import { useTable } from 'react-table';
// ray test touch >>
import Big from 'big.js';
import clsx from 'clsx';
import {
  // ray test touch <<
  // roundTwoDecimals,
  // ray test touch >>
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

// ray test touch <<
// import DashboardTable from '../dashboard-table/dashboard-table';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
// ray test touch >>
// ray test touch <<
// import InterlayTooltip from 'components/UI/InterlayTooltip';
// import { shortAddress } from '../../utils/utils';
// import * as constants from '../../../constants';
// ray test touch >>
import { StoreType } from 'common/types/util.types';
import { Vault } from '../../types/vault.types';

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

const getVaultStatus = (
  status: VaultStatusExt,
  collateralization: Big | undefined,
  bannedUntil: string | undefined,
  liquidationThreshold: Big,
  secureCollateralThreshold: Big
): string => {
  if (status === VaultStatusExt.CommittedTheft) {
    return t('dashboard.vault.theft');
  }
  if (status === VaultStatusExt.Liquidated) {
    return t('dashboard.vault.liquidated');
  }
  if (collateralization) {
    if (collateralization.lt(liquidationThreshold)) {
      return t('dashboard.vault.liquidation');
    }
    if (collateralization.lt(secureCollateralThreshold)) {
      return t('dashboard.vault.undercollateralized');
    }
  }
  if (bannedUntil) {
    return t('dashboard.vault.banned_until', { blockHeight: bannedUntil });
  }
  if (status === VaultStatusExt.Inactive) {
    return t('dashboard.vault.inactive');
  }
  return t('dashboard.vault.active');
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

          theVaults.push({
            vaultId: vault.id.toString(),
            // TODO: fetch collateral reserved
            lockedBTC: settledTokens.toHuman(),
            lockedDOT: vaultCollateral.toHuman(),
            pendingBTC: unsettledTokens.toHuman(),
            btcAddress: btcAddress,
            status:
              getVaultStatus(
                vault.status,
                settledCollateralization,
                vault.bannedUntil?.toString(),
                theLiquidationThreshold,
                theSecureCollateralThreshold
              ),
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

  // ray test touch <<
  // const tableHeadings: React.ReactElement[] = [
  //   <h1
  //     className='opacity-30'
  //     key={1}>
  //     {t('account_id')}
  //   </h1>,
  //   <h1
  //     className='opacity-30'
  //     key={2}>
  //     {t('locked_dot')}
  //   </h1>,
  //   <h1
  //     className='opacity-30'
  //     key={3}>
  //     {t('locked_btc')}
  //   </h1>,
  //   <>
  //     <h1 className='opacity-30'>{t('pending_btc')}</h1> &nbsp;
  //     <InterlayTooltip label={t('vault.tip_pending_btc')}>
  //       <i className='far fa-question-circle' />
  //     </InterlayTooltip>
  //   </>,
  //   <>
  //     <h1 className='opacity-30'>{t('collateralization')}</h1> &nbsp;
  //     <InterlayTooltip label={t('vault.tip_collateralization')}>
  //       <i className='far fa-question-circle' />
  //     </InterlayTooltip>
  //   </>,
  //   <h1
  //     className='opacity-30'
  //     key={4}>
  //     {t('status')}
  //   </h1>
  // ];
  // ray test touch >>

  // ray test touch <<
  // const tableVaultRow = React.useMemo(() => {
  //   const getStatusColor = (status: string): string => {
  //     if (status === constants.VAULT_STATUS_ACTIVE) {
  //       return clsx(
  //         'text-interlayConifer',
  //         'font-medium'
  //       );
  //     }
  //     if (status === constants.VAULT_STATUS_UNDER_COLLATERALIZED) {
  //       return clsx(
  //         'text-interlayCalifornia',
  //         'font-medium'
  //       );
  //     }
  //     if (
  //       status === constants.VAULT_STATUS_THEFT ||
  //       status === constants.VAULT_STATUS_AUCTION ||
  //       status === constants.VAULT_STATUS_LIQUIDATED
  //     ) {
  //       return clsx(
  //         'text-interlayCinnabar',
  //         'font-medium'
  //       );
  //     }
  //     return 'black-text';
  //   };
  //   const getCollateralizationColor = (collateralization: string | undefined): string => {
  //     if (typeof collateralization !== 'undefined') {
  //       if (new Big(collateralization).gte(secureCollateralThreshold)) {
  //         return clsx(
  //           'text-interlayConifer',
  //           'font-medium'
  //         );
  //       }
  //       // Liquidation
  //       return clsx(
  //         'text-interlayCinnabar',
  //         'font-medium'
  //       );
  //     }
  //     return 'black-text';
  //   };
  // ray test touch >>
  // ray test touch <<
  // const showCollateralizations = (vault: Vault) => {
  //   if (vault.unsettledCollateralization === undefined && vault.settledCollateralization === undefined) {
  //     return <td className={getCollateralizationColor(vault.unsettledCollateralization)}>∞</td>;
  //   }
  //   return (
  //     <td>
  //       <p className={getCollateralizationColor(vault.settledCollateralization)}>
  //         {vault.settledCollateralization === undefined ?
  //           '∞' :
  //           roundTwoDecimals(vault.settledCollateralization.toString()) + '%'}
  //       </p>
  //       <p className='small-text'>
  //         <span className='black-text'>{t('vault.pending_table_subcell')}</span>
  //         <span className={getCollateralizationColor(vault.unsettledCollateralization)}>
  //           {vault.unsettledCollateralization === undefined ?
  //             '∞' :
  //             roundTwoDecimals(vault.unsettledCollateralization.toString()) + '%'}
  //         </span>
  //       </p>
  //     </td>
  //   );
  // };
  // ray test touch >>
  // ray test touch <<
  //   return (vault: Vault): React.ReactElement[] => [
  //     <p key={1}>{shortAddress(vault.vaultId)}</p>,
  //     <p key={2}>{vault.lockedDOT}</p>,
  //     <p key={3}>{vault.lockedBTC}</p>,
  //     <p key={4}>{vault.pendingBTC}</p>,
  //     <p key={5}>{showCollateralizations(vault)}</p>,
  //     <p
  //       key={6}
  //       className={getStatusColor(vault.status)}>
  //       {vault.status}
  //     </p>
  //   ];
  // }, [secureCollateralThreshold, t]);
  // ray test touch >>

  // ray test touch <<
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
          'text-left'
        ]
      },
      {
        Header: t('collateralization'),
        accessor: '',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell(props: any) {
          return (
            <>{props.row.original.settledCollateralization} {props.row.original.unsettledCollateralization}</>
          );
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: [
          'text-left'
        ]
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
      data: vaults
    }
  );

  // TODO: pagination
  console.log('ray : ***** secureCollateralThreshold => ', secureCollateralThreshold);
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
  // return (
  //   <div style={{ margin: '40px 0px' }}>
  //     <div>
  //       <p
  //         className='mb-4'
  //         style={{
  //           fontWeight: 700,
  //           fontSize: '26px'
  //         }}>
  //         {t('dashboard.vault.active_vaults')}
  //       </p>
  //     </div>
  //     <DashboardTable
  //       pageData={vaults.map(vault => ({ ...vault, id: vault.vaultId }))}
  //       headings={tableHeadings}
  //       dataPointDisplayer={tableVaultRow}
  //       noDataEl={<td colSpan={6}>{t('loading')}</td>} />
  //   </div>
  // );
  // ray test touch >>
};

export default VaultTable;
