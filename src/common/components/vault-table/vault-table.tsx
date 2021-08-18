
// ray test touch <<
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import {
  roundTwoDecimals,
  VaultStatusExt,
  VaultExt
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

import DashboardTable from '../dashboard-table/dashboard-table';
import InterlayTooltip from 'components/UI/InterlayTooltip';
import { shortAddress } from '../../utils/utils';
import * as constants from '../../../constants';
import { StoreType } from '../../../common/types/util.types';
import { Vault } from '../../types/vault.types';

const VaultTable = (): JSX.Element => {
  const [vaults, setVaults] = React.useState<Array<Vault>>([]);
  const [vaultsExt, setVaultsExt] = React.useState<Array<VaultExt>>([]);
  const [liquidationThreshold, setLiquidationThreshold] = React.useState(new Big(0));
  const [secureCollateralThreshold, setSecureCollateralThreshold] = React.useState(new Big(0));
  const [btcToDotRate, setBtcToDotRate] = React.useState(
    new ExchangeRate<Bitcoin, BTCUnit, Polkadot, PolkadotUnit>(Bitcoin, Polkadot, new Big(0))
  );
  const { t } = useTranslation();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

    (async () => {
      try {
        const [
          secure,
          liquidation,
          btcToDot,
          vaultsExt
        ] = await Promise.all([
          window.polkaBTC.vaults.getSecureCollateralThreshold(),
          window.polkaBTC.vaults.getLiquidationCollateralThreshold(),
          window.polkaBTC.oracle.getExchangeRate(Polkadot),
          window.polkaBTC.vaults.list()
        ]);

        setSecureCollateralThreshold(secure);
        setLiquidationThreshold(liquidation);
        setBtcToDotRate(btcToDot);
        setVaultsExt(vaultsExt);
      } catch (error) {
        console.log('[VaultTable] error.message => ', error.message);
      }
    })();
  }, [polkaBtcLoaded]);

  const checkVaultStatus = React.useCallback(
    (
      status: VaultStatusExt,
      collateralization: Big | undefined,
      bannedUntil: string | undefined
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
        return t('dashboard.vault.banned_until', { blockheight: bannedUntil });
      }
      if (status === VaultStatusExt.Inactive) {
        return t('dashboard.vault.inactive');
      }
      return t('dashboard.vault.active');
    }, [
      liquidationThreshold,
      secureCollateralThreshold,
      t
    ]);

  React.useEffect(() => {
    if (vaultsExt.length === 0) return;
    if (secureCollateralThreshold.eq(0)) return;
    const vaultsList: Vault[] = [];

    for (const vault of vaultsExt) {
      const getCollateralization = (collateral: PolkadotAmount, tokens: BTCAmount) => {
        if (tokens.gt(BTCAmount.zero) && btcToDotRate.toBig().gt(0)) {
          const tokensAsCollateral = btcToDotRate.toCounter(tokens);
          return collateral.toBig().div(tokensAsCollateral.toBig()).mul(100);
        } else {
          return undefined;
        }
      };

      const vaultCollateral = vault.backingCollateral;
      const unsettledTokens = vault.toBeIssuedTokens;
      const settledTokens = vault.issuedTokens;
      const unsettledCollateralization = getCollateralization(vaultCollateral, unsettledTokens.add(settledTokens));
      const settledCollateralization = getCollateralization(vaultCollateral, settledTokens);

      const btcAddress = vault.wallet.publicKey; // TODO: get address(es)?

      vaultsList.push({
        vaultId: vault.id.toString(),
        // TODO: fetch collateral reserved
        lockedBTC: settledTokens.toHuman(),
        lockedDOT: vaultCollateral.toHuman(),
        pendingBTC: unsettledTokens.toHuman(),
        btcAddress: btcAddress || '',
        status:
          checkVaultStatus(
            vault.status,
            settledCollateralization,
            vault.bannedUntil?.toString()
          ),
        unsettledCollateralization: unsettledCollateralization?.toString(),
        settledCollateralization: settledCollateralization?.toString()
      });
      // TODO: hacky way to update 5 vaults at a time
      if (vaultsList.length % 5 === 0) {
        setVaults(vaultsList);
      }
    }
    setVaults(vaultsList);
  }, [
    vaultsExt,
    secureCollateralThreshold,
    checkVaultStatus,
    btcToDotRate
  ]);

  const tableHeadings: React.ReactElement[] = [
    <h1
      className='opacity-30'
      key={1}>
      {t('account_id')}
    </h1>,
    <h1
      className='opacity-30'
      key={2}>
      {t('locked_dot')}
    </h1>,
    <h1
      className='opacity-30'
      key={3}>
      {t('locked_btc')}
    </h1>,
    <>
      <h1 className='opacity-30'>{t('pending_btc')}</h1> &nbsp;
      <InterlayTooltip label={t('vault.tip_pending_btc')}>
        <i className='far fa-question-circle' />
      </InterlayTooltip>
    </>,
    <>
      <h1 className='opacity-30'>{t('collateralization')}</h1> &nbsp;
      <InterlayTooltip label={t('vault.tip_collateralization')}>
        <i className='far fa-question-circle' />
      </InterlayTooltip>
    </>,
    <h1
      className='opacity-30'
      key={4}>
      {t('status')}
    </h1>
  ];

  const tableVaultRow = React.useMemo(() => {
    const getStatusColor = (status: string): string => {
      if (status === constants.VAULT_STATUS_ACTIVE) {
        return clsx(
          'text-interlayConifer',
          'font-medium'
        );
      }
      if (status === constants.VAULT_STATUS_UNDER_COLLATERALIZED) {
        return clsx(
          'text-interlayCalifornia',
          'font-medium'
        );
      }
      if (
        status === constants.VAULT_STATUS_THEFT ||
        status === constants.VAULT_STATUS_AUCTION ||
        status === constants.VAULT_STATUS_LIQUIDATED
      ) {
        return clsx(
          'text-interlayCinnabar',
          'font-medium'
        );
      }
      return 'black-text';
    };

    const getCollateralizationColor = (collateralization: string | undefined): string => {
      if (typeof collateralization !== 'undefined') {
        if (new Big(collateralization).gte(secureCollateralThreshold)) {
          return clsx(
            'text-interlayConifer',
            'font-medium'
          );
        }
        // Liquidation
        return clsx(
          'text-interlayCinnabar',
          'font-medium'
        );
      }
      return 'black-text';
    };

    const showCollateralizations = (vault: Vault) => {
      if (vault.unsettledCollateralization === undefined && vault.settledCollateralization === undefined) {
        return <td className={getCollateralizationColor(vault.unsettledCollateralization)}>∞</td>;
      }
      return (
        <td>
          <p className={getCollateralizationColor(vault.settledCollateralization)}>
            {vault.settledCollateralization === undefined ?
              '∞' :
              roundTwoDecimals(vault.settledCollateralization.toString()) + '%'}
          </p>
          <p className='small-text'>
            <span className='black-text'>{t('vault.pending_table_subcell')}</span>
            <span className={getCollateralizationColor(vault.unsettledCollateralization)}>
              {vault.unsettledCollateralization === undefined ?
                '∞' :
                roundTwoDecimals(vault.unsettledCollateralization.toString()) + '%'}
            </span>
          </p>
        </td>
      );
    };

    return (vault: Vault): React.ReactElement[] => [
      <p key={1}>{shortAddress(vault.vaultId)}</p>,
      <p key={2}>{vault.lockedDOT}</p>,
      <p key={3}>{vault.lockedBTC}</p>,
      <p key={4}>{vault.pendingBTC}</p>,
      <p key={5}>{showCollateralizations(vault)}</p>,
      <p
        key={6}
        className={getStatusColor(vault.status)}>
        {vault.status}
      </p>
    ];
  }, [secureCollateralThreshold, t]);

  return (
    <div style={{ margin: '40px 0px' }}>
      <div>
        <p
          className='mb-4'
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('dashboard.vault.active_vaults')}
        </p>
      </div>
      <DashboardTable
        pageData={vaults.map(vault => ({ ...vault, id: vault.vaultId }))}
        headings={tableHeadings}
        dataPointDisplayer={tableVaultRow}
        noDataEl={<td colSpan={6}>{t('loading')}</td>} />
    </div>
  );
};

export default VaultTable;
// ray test touch >>
