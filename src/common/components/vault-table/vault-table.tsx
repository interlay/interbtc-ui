import React, { ReactElement, useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Vault } from "../../types/vault.types";
import * as constants from "../../../constants";
import { planckToDOT, satToBTC, roundTwoDecimals } from "@interlay/polkabtc";
import { shortAddress } from "../../utils/utils";
import { useTranslation } from "react-i18next";
import Big from "big.js";
import { StoreType } from "../../../common/types/util.types";
import DashboardTable from "../dashboard-table/dashboard-table";

export default function VaultTable(): ReactElement {
    const [vaults, setVaults] = useState<Array<Vault>>([]);
    const [liquidationThreshold, setLiquidationThreshold] = useState(new Big(0));
    const [auctionCollateralThreshold, setAuctionCollateralThreshold] = useState(new Big(0));
    const [premiumRedeemThreshold, setPremiumRedeemThreshold] = useState(new Big(0));
    const [secureCollateralThreshold, setSecureCollateralThreshold] = useState(new Big(0));
    const { t } = useTranslation();
    const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const [auction, premium, secure, liquidation] = await Promise.all([
                window.polkaBTC.vaults.getAuctionCollateralThreshold(),
                window.polkaBTC.vaults.getPremiumRedeemThreshold(),
                window.polkaBTC.vaults.getSecureCollateralThreshold(),
                window.polkaBTC.vaults.getLiquidationCollateralThreshold(),
            ]);

            setAuctionCollateralThreshold(auction);
            setPremiumRedeemThreshold(premium);
            setSecureCollateralThreshold(secure);
            setLiquidationThreshold(liquidation);
        };
        fetchData();
    }, [polkaBtcLoaded]);

    useEffect(() => {
        const checkVaultStatus = (status: string, collateralization: Big | undefined): string => {
            if (status === constants.VAULT_STATUS_THEFT) {
                return constants.VAULT_STATUS_THEFT;
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
            return constants.VAULT_STATUS_ACTIVE;
        };

        const fetchData = async () => {
            if (!polkaBtcLoaded) return;
            if (secureCollateralThreshold.eq(0)) return;

            const vaults = await window.polkaBTC.vaults.list();
            const vaultsList: Vault[] = [];

            for (const vault of vaults) {
                const accountId = window.polkaBTC.api.createType("AccountId", vault.id);
                let unsettledCollateralization: Big | undefined = undefined;
                let settledCollateralization: Big | undefined = undefined;
                try {
                    [unsettledCollateralization, settledCollateralization] = await Promise.all([
                        window.polkaBTC.vaults.getVaultCollateralization(vault.id),
                        window.polkaBTC.vaults.getVaultCollateralization(vault.id, undefined, true),
                    ]);
                } catch (error) {
                    console.log(error);
                }

                const btcAddress = vault.wallet.btcAddress;

                const balanceLockedPlanck = await window.polkaBTC.collateral.balanceLockedDOT(accountId);
                const balanceLockedDOT = planckToDOT(balanceLockedPlanck.toString());

                vaultsList.push({
                    vaultId: accountId.toString(),
                    // TODO: fetch collateral reserved
                    lockedBTC: satToBTC(vault.issued_tokens.toString()),
                    lockedDOT: balanceLockedDOT,
                    pendingBTC: satToBTC(vault.to_be_issued_tokens.toString()),
                    btcAddress: btcAddress || "",
                    status: vault.status && checkVaultStatus(vault.status.toString(), unsettledCollateralization),
                    unsettledCollateralization: unsettledCollateralization?.mul(100).toString(),
                    settledCollateralization: settledCollateralization?.mul(100).toString(),
                });
            }

            setVaults(vaultsList);
        };

        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, constants.COMPONENT_UPDATE_MS);
        return () => clearInterval(interval);
    }, [
        polkaBtcLoaded,
        liquidationThreshold,
        auctionCollateralThreshold,
        premiumRedeemThreshold,
        secureCollateralThreshold,
    ]);

    const tableHeadings: ReactElement[] = [
        <h1>{t("account_id")}</h1>,
        <h1>{t("locked_dot")}</h1>,
        <h1>{t("locked_btc")}</h1>,
        <>
            <h1>{t("pending_btc")}</h1> &nbsp;
            <i className="far fa-question-circle" data-tip={t("vault.tip_pending_btc")}></i>
        </>,
        <>
            <h1>{t("collateralization")}</h1> &nbsp;
            <i className="far fa-question-circle" data-tip={t("vault.tip_collateralization")}></i>
        </>,
        <h1>{t("status")}</h1>,
    ];

    const tableVaultRow = useMemo(() => {
        const getStatusColor = (status: string): string => {
            if (status === constants.VAULT_STATUS_ACTIVE) {
                return "green-text";
            }
            if (status === constants.VAULT_STATUS_UNDER_COLLATERALIZED) {
                return "orange-text";
            }
            if (
                status === constants.VAULT_STATUS_THEFT ||
                status === constants.VAULT_STATUS_AUCTION ||
                status === constants.VAULT_STATUS_LIQUIDATED
            ) {
                return "red-text";
            }
            return "black-text";
        };

        const getCollateralizationColor = (collateralization: string | undefined): string => {
            if (typeof collateralization !== "undefined") {
                if (new Big(collateralization).gte(secureCollateralThreshold)) {
                    return "green-text";
                }
                if (new Big(collateralization).gte(auctionCollateralThreshold)) {
                    return "orange-text";
                }
                // Liquidation
                return "red-text";
            }
            return "black-text";
        };

        const showCollateralizations = (vault: Vault) => {
            if (vault.unsettledCollateralization === undefined && vault.settledCollateralization === undefined) {
                return <td className={getCollateralizationColor(vault.unsettledCollateralization)}>∞</td>;
            }
            return (
                <td>
                    <p className={getCollateralizationColor(vault.settledCollateralization)}>
                        {vault.settledCollateralization !== undefined
                            ? roundTwoDecimals(vault.settledCollateralization.toString()) + "%"
                            : "∞"}
                    </p>
                    <p className="small-text">
                        <span className="black-text">{t("vault.pending_table_subcell")}</span>
                        <span className={getCollateralizationColor(vault.unsettledCollateralization)}>
                            {vault.unsettledCollateralization !== undefined
                                ? roundTwoDecimals(vault.unsettledCollateralization.toString()) + "%"
                                : "∞"}
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
            <p className={getStatusColor(vault.status)}>{vault.status}</p>,
        ];
    }, [auctionCollateralThreshold, secureCollateralThreshold, t]);

    return (
        <div className="dashboard-table-container">
            <div>
                <p className="table-heading">{t("dashboard.vaults.active_vaults")}</p>
            </div>
            <DashboardTable
                pageData={vaults.map((vault) => ({ ...vault, id: vault.vaultId }))}
                headings={tableHeadings}
                dataPointDisplayer={tableVaultRow}
                noDataEl={<td colSpan={6}>{t("no_registered_vaults")}</td>}
            />
        </div>
    );
}
