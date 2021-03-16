import { ReactElement, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Vault } from '../../types/vault.types';
import * as constants from '../../../constants';
import { planckToDOT, satToBTC, roundTwoDecimals } from '@interlay/polkabtc';
import { shortAddress } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import { StoreType } from '../../../common/types/util.types';
import DashboardTable from '../dashboard-table/dashboard-table';
import { ACCOUNT_ID_TYPE_NAME } from '../../../constants';

export default function VaultTable(): ReactElement {
  const [vaults, setVaults] = useState<Array<Vault>>([]);
  const [liquidationThreshold, setLiquidationThreshold] = useState(new Big(0));
  const [auctionCollateralThreshold, setAuctionCollateralThreshold] = useState(new Big(0));
  const [premiumRedeemThreshold, setPremiumRedeemThreshold] = useState(new Big(0));
  const [secureCollateralThreshold, setSecureCollateralThreshold] = useState(new Big(0));
  const [btcToDotRate, setBtcToDotRate] = useState(new Big(0));
  const { t } = useTranslation();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded) return;

      try {
        const [auction, premium, secure, liquidation, btcToDot] = await Promise.all([
          window.polkaBTC.vaults.getAuctionCollateralThreshold(),
          window.polkaBTC.vaults.getPremiumRedeemThreshold(),
          window.polkaBTC.vaults.getSecureCollateralThreshold(),
          window.polkaBTC.vaults.getLiquidationCollateralThreshold(),
          window.polkaBTC.oracle.getExchangeRate()
        ]);

        setAuctionCollateralThreshold(auction);
        setPremiumRedeemThreshold(premium);
        setSecureCollateralThreshold(secure);
        setLiquidationThreshold(liquidation);
        setBtcToDotRate(btcToDot);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [polkaBtcLoaded]);

  useEffect(() => {
    const checkVaultStatus = (
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
    };

    const fetchData = async () => {
      if (!polkaBtcLoaded) return;
      if (secureCollateralThreshold.eq(0)) return;

      const vaults = await window.polkaBTC.vaults.list();
      const vaultsList: Vault[] = [];

      for (const vault of vaults) {
        const accountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vault.id);

        const getCollateralization = (collateral: Big, tokens: Big) => {
          if (tokens.gt(0) && btcToDotRate.gt(0)) {
            return collateral.div(tokens).div(btcToDotRate).mul(100);
          } else {
            return undefined;
          }
        };

        const vaultCollateral = new Big(planckToDOT(vault.backing_collateral.toString()));
        const unsettledTokens = new Big(satToBTC(vault.issued_tokens.toString())).add(new Big(satToBTC(vault.to_be_issued_tokens.toString())));
        const settledTokens = new Big(satToBTC(vault.issued_tokens.toString()));
        const unsettledCollateralization = getCollateralization(vaultCollateral, unsettledTokens);
        const settledCollateralization = getCollateralization(vaultCollateral, settledTokens);

        const btcAddress = vault.wallet.btcAddress;

        const balanceLockedPlanck = await window.polkaBTC.collateral.balanceLockedDOT(accountId);
        const balanceLockedDOT = planckToDOT(balanceLockedPlanck.toString());

        vaultsList.push({
          vaultId: accountId.toString(),
          // TODO: fetch collateral reserved
          lockedBTC: satToBTC(vault.issued_tokens.toString()),
          lockedDOT: balanceLockedDOT,
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
    polkaBtcLoaded,
    liquidationThreshold,
    auctionCollateralThreshold,
    premiumRedeemThreshold,
    secureCollateralThreshold,
    btcToDotRate,
    t
  ]);

  const tableHeadings: ReactElement[] = [
    <h1>{t('account_id')}</h1>,
    <h1>{t('locked_dot')}</h1>,
    <h1>{t('locked_btc')}</h1>,
    <>
      <h1>{t('pending_btc')}</h1> &nbsp;
      <i
        className='far fa-question-circle'
        data-tip={t('vault.tip_pending_btc')}>
      </i>
    </>,
    <>
      <h1>{t('collateralization')}</h1> &nbsp;
      <i
        className='far fa-question-circle'
        data-tip={t('vault.tip_collateralization')}>
      </i>
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
            fontFamily: 'airbnb-cereal-bold',
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
