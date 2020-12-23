import React, { ReactElement, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Vault } from "../../types/vault.types";
import { updatePremiumVaultAction } from "../../actions/vault.actions";
import * as constants from "../../../constants";
import { planckToDOT, satToBTC, roundTwoDecimals } from "@interlay/polkabtc";
import { shortAddress } from "../../utils/utils";
import BitcoinAddress from "../bitcoin-links/address";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RedeemWizard from "../../../pages/redeem/wizard/redeem-wizard";
import { resetRedeemWizardAction } from "../../actions/redeem.actions";
import { toast } from "react-toastify";
import { StoreType, ParachainStatus } from "../../types/util.types";
import { showAccountModalAction } from "../../actions/general.actions";
import Big from "big.js";

type VaultTableProps = {
    isRelayer: boolean | undefined;
};

export default function VaultTable(props: VaultTableProps): ReactElement {
    const [vaults, setVaults] = useState<Array<Vault>>([]);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const { t } = useTranslation();
    const [showWizard, setShowWizard] = useState(false);
    const [liquidationThreshold, setLiquidationThreshold] = useState(new Big(0));
    const [auctionCollateralThreshold, setAuctionCollateralThreshold] = useState(new Big(0));
    const [premiumRedeemThreshold, setPremiumRedeemThreshold] = useState(new Big(0));
    const [secureCollateralThreshold, setSecureCollateralThreshold] = useState(new Big(0));
    const dispatch = useDispatch();
    const { address, extensions, btcRelayHeight, bitcoinHeight, stateOfBTCParachain } = useSelector(
        (state: StoreType) => state.general
    );

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
        const checkVaultStatus = (status: string, collateralization: Big): string => {
            if (status === constants.VAULT_STATUS_THEFT) {
                return constants.VAULT_STATUS_THEFT;
            }
            if (status === constants.VAULT_STATUS_LIQUIDATED) {
                return constants.VAULT_STATUS_LIQUIDATED;
            }
            if (collateralization.lt(liquidationThreshold)) {
                return constants.VAULT_STATUS_LIQUIDATION;
            }
            if (collateralization.lt(auctionCollateralThreshold)) {
                return constants.VAULT_STATUS_AUCTION;
            }
            if (collateralization.lt(secureCollateralThreshold)) {
                return constants.VAULT_STATUS_UNDER_COLLATERALIZED;
            }
            return constants.VAULT_STATUS_ACTIVE;
        };

        const fetchData = async () => {
            if (!polkaBtcLoaded) return;
            if (secureCollateralThreshold.eq(0)) return;

            const vaults = await window.polkaBTC.vaults.list();
            const vaultsList: Vault[] = [];

            for (let vault of vaults) {
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

                let btcAddress = vault.wallet.address;

                const balanceLockedPlanck = await window.polkaBTC.collateral.balanceLockedDOT(accountId);
                const balanceLockedDOT = planckToDOT(balanceLockedPlanck.toString());

                vaultsList.push({
                    vaultId: accountId.toString(),
                    // TODO: fetch collateral reserved
                    lockedBTC: satToBTC(vault.issued_tokens.toString()),
                    lockedDOT: balanceLockedDOT,
                    pendingBTC: satToBTC(vault.to_be_issued_tokens.toString()),
                    btcAddress: btcAddress || "",
                    status:
                        vault.status &&
                        checkVaultStatus(vault.status.toString(), unsettledCollateralization || new Big(0)),
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
                    <span className="black-text">{"Pending: "}</span>
                    <span className={getCollateralizationColor(vault.unsettledCollateralization)}>
                        {vault.unsettledCollateralization !== undefined
                            ? roundTwoDecimals(vault.unsettledCollateralization.toString()) + "%"
                            : "∞"}
                    </span>
                </p>
            </td>
        );
    };

    const handleCloseWizard = () => {
        dispatch(resetRedeemWizardAction());
        setShowWizard(false);
    };

    const openRedeemWizard = (vault: Vault) => {
        if (stateOfBTCParachain === ParachainStatus.Error) {
            toast.error(t("redeem_page.error_in_parachain"));
            return;
        }
        if (bitcoinHeight - btcRelayHeight > constants.BLOCKS_BEHIND_LIMIT) {
            toast.error(t("redeem_page.error_more_than_6_blocks_behind"));
            return;
        }
        if (address && extensions.length) {
            dispatch(updatePremiumVaultAction(vault));
            setShowWizard(true);
        } else {
            dispatch(showAccountModalAction(true));
        }
    };

    const showPremiumButton = (vault: Vault): boolean => {
        if (vault.unsettledCollateralization === undefined && vault.settledCollateralization === undefined) {
            return false;
        }
        if (
            vault.settledCollateralization !== undefined &&
            new Big(vault.settledCollateralization).gt(auctionCollateralThreshold) &&
            new Big(vault.settledCollateralization).lt(premiumRedeemThreshold)
        ) {
            return true;
        }
        return false;
    };

    return (
        <div className="vault-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">Vaults</div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>AccountID</th>
                                    <th>BTC Address</th>
                                    <th>Locked DOT</th>
                                    <th>Locked BTC</th>
                                    <th>
                                        Pending BTC &nbsp;
                                        <i
                                            className="far fa-question-circle"
                                            data-tip="BTC volume of in-progress issue requests."
                                        ></i>
                                    </th>
                                    <th>
                                        Collateralization &nbsp;
                                        <i
                                            className="far fa-question-circle"
                                            data-tip="Collateralization rate for locked BTC.
                                           'Pending' includes in-progress issue requests."
                                        ></i>
                                    </th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {vaults && vaults.length ? (
                                <tbody>
                                    {vaults.map((vault, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{shortAddress(vault.vaultId)}</td>
                                                <td className="break-words">
                                                    <BitcoinAddress shorten={true} btcAddress={vault.btcAddress} />
                                                </td>
                                                <td>{vault.lockedDOT}</td>
                                                <td>{vault.lockedBTC}</td>
                                                <td>{vault.pendingBTC}</td>
                                                {showCollateralizations(vault)}
                                                <td className={getStatusColor(vault.status)}>
                                                    {!props.isRelayer && showPremiumButton(vault) ? (
                                                        <Button onClick={() => openRedeemWizard(vault)}>
                                                            {t("dashboard.premium_redeem")}
                                                        </Button>
                                                    ) : (
                                                        <span>{vault.status}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan={7}>No registered vaults</td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={showWizard} onHide={handleCloseWizard} size={"lg"}>
                <RedeemWizard handleClose={handleCloseWizard} />
            </Modal>
        </div>
    );
}
