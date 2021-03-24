import { ReactElement, useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Vault } from '../../types/vault.types';
import * as constants from '../../../constants';
import { planckToDOT, satToBTC, roundTwoDecimals } from '@interlay/polkabtc';
import { shortAddress } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import { StoreType } from '../../../common/types/util.types';
import DashboardTable from '../dashboard-table/dashboard-table';
import { VaultExt } from '@interlay/polkabtc/build/parachain/vaults';
import InterlayTooltip from 'components/InterlayTooltip';

export default function VaultTable(): ReactElement {
  const [vaults, setVaults] = useState<Array<Vault>>([]);
  const [vaultsExt, setVaultsExt] = useState<Array<VaultExt>>([]);
  const [liquidationThreshold, setLiquidationThreshold] = useState(new Big(0));
  const [auctionCollateralThreshold, setAuctionCollateralThreshold] = useState(new Big(0));
  const [secureCollateralThreshold, setSecureCollateralThreshold] = useState(new Big(0));
  const [btcToDotRate, setBtcToDotRate] = useState(new Big(0));
  const { t } = useTranslation();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded) return;

      try {
        const [
          auction,
          secure,
          liquidation,
          btcToDot,
          vaultsExt
        ] = await Promise.all([
          window.polkaBTC.vaults.getAuctionCollateralThreshold(),
          window.polkaBTC.vaults.getSecureCollateralThreshold(),
          window.polkaBTC.vaults.getLiquidationCollateralThreshold(),
          window.polkaBTC.oracle.getExchangeRate(),
          window.polkaBTC.vaults.list()
        ]);

        setAuctionCollateralThreshold(auction);
        setSecureCollateralThreshold(secure);
        setLiquidationThreshold(liquidation);
        setBtcToDotRate(btcToDot);
        setVaultsExt(vaultsExt);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [polkaBtcLoaded]);

  const checkVaultStatus = useCallback(
    (
      status: string,
      collateralization: Big | undefined,
      bannedUntil: string | undefined
    ): string => {
      if (status === constants.VAULT_STATUS_THEFT) {
        return t('dashboard.vault.theft');
      }
      if (status === constants.VAULT_STATUS_LIQUIDATED) {
        return constants.VAULT_STATUS_LIQUIDATED;
      }
      if (collateralization) {
        if (collateralization.lt(liquidationThreshold)) {
          return constants.VAULT_STATUS_LIQUIDATION;
        }
        if (collateralization.lt(auctionCollateralThreshold)) {
          return constants.VAULT_STATUS_AUCTION;
        }
        if (collateralization.lt(secureCollateralThreshold)) {
          return constants.VAULT_STATUS_UNDER_COLLATERALIZED;
        }
      }
      if (bannedUntil) {
        return constants.VAULT_STATUS_BANNED + bannedUntil;
      }
      return constants.VAULT_STATUS_ACTIVE;
    }, [
      auctionCollateralThreshold,
      liquidationThreshold,
      secureCollateralThreshold,
      t
    ]);

  useEffect(() => {
    const fetchData = () => {
      if (vaultsExt.length === 0) return;
      if (secureCollateralThreshold.eq(0)) return;

      const vaultsList: Vault[] = [];

      for (const vault of vaultsExt) {
        const getCollateralization = (collateral: Big, tokens: Big) => {
          if (tokens.gt(0) && btcToDotRate.gt(0)) {
            return collateral.div(tokens).div(btcToDotRate).mul(100);
          } else {
            return undefined;
          }
        };

        const vaultCollateral = new Big(planckToDOT(vault.backing_collateral.toString()));
        const unsettledTokens = new Big(satToBTC(vault.issued_tokens.toString()))
          .add(new Big(satToBTC(vault.to_be_issued_tokens.toString())));
        const settledTokens = new Big(satToBTC(vault.issued_tokens.toString()));
        const unsettledCollateralization = getCollateralization(vaultCollateral, unsettledTokens);
        const settledCollateralization = getCollateralization(vaultCollateral, settledTokens);

        const btcAddress = vault.wallet.btcAddress;

        vaultsList.push({
          vaultId: vault.id.toString(),
          // TODO: fetch collateral reserved
          lockedBTC: satToBTC(vault.issued_tokens.toString()),
          lockedDOT: vaultCollateral.toString(),
          pendingBTC: satToBTC(vault.to_be_issued_tokens.toString()),
          btcAddress: btcAddress || '',
          status:
            vault.status &&
            checkVaultStatus(
              vault.status.toString(),
              settledCollateralization,
              vault.banned_until.toString()
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
    };
    fetchData();
  }, [
    vaultsExt,
    secureCollateralThreshold,
    checkVaultStatus,
    btcToDotRate
  ]);

  const tableHeadings: ReactElement[] = [
    <h1>{t('account_id')}</h1>,
    <h1>{t('locked_dot')}</h1>,
    <h1>{t('locked_btc')}</h1>,
    <>
      <h1>{t('pending_btc')}</h1> &nbsp;
      <InterlayTooltip overlay={t('vault.tip_pending_btc')}>
        <i className='far fa-question-circle' />
      </InterlayTooltip>
    </>,
    <>
      <h1>{t('collateralization')}</h1> &nbsp;
      <InterlayTooltip overlay={t('vault.tip_collateralization')}>
        <i className='far fa-question-circle' />
      </InterlayTooltip>
    </>,
    <h1>{t('status')}</h1>
  ];

  const tableVaultRow = useMemo(() => {
    const getStatusColor = (status: string): string => {
      if (status === constants.VAULT_STATUS_ACTIVE) {
        return 'green-text';
      }
      if (status === constants.VAULT_STATUS_UNDER_COLLATERALIZED) {
        return 'orange-text';
      }
      if (
        status === constants.VAULT_STATUS_THEFT ||
        status === constants.VAULT_STATUS_AUCTION ||
        status === constants.VAULT_STATUS_LIQUIDATED
      ) {
        return 'red-text';
      }
      return 'black-text';
    };

    const getCollateralizationColor = (collateralization: string | undefined): string => {
      if (typeof collateralization !== 'undefined') {
        if (new Big(collateralization).gte(secureCollateralThreshold)) {
          return 'green-text';
        }
        if (new Big(collateralization).gte(auctionCollateralThreshold)) {
          return 'orange-text';
        }
        // Liquidation
        return 'red-text';
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

    return (vault: Vault): ReactElement[] => [
      <p>{shortAddress(vault.vaultId)}</p>,
      <p>{vault.lockedDOT}</p>,
      <p>{vault.lockedBTC}</p>,
      <p>{vault.pendingBTC}</p>,
      <p>{showCollateralizations(vault)}</p>,
      <p className={getStatusColor(vault.status)}>{vault.status}</p>
    ];
  }, [auctionCollateralThreshold, secureCollateralThreshold, t]);

  return (
    <div style={{ margin: '40px 0px' }}>
      <div>
        <p
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
}
