import React, { ReactElement, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Vault } from "../../types/vault.types";
import { updatePremiumVaultAction } from "../../actions/vault.actions";
import * as constants from "../../../constants";
import { planckToDOT, satToBTC, roundTwoDecimals } from "@interlay/polkabtc";
import { encodeBitcoinAddress, shortAddress, convertToPercentage } from "../../utils/utils";
import BitcoinAddress from "../bitcoin-links/address";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import RedeemWizard from "../../../pages/redeem/wizard/redeem-wizard";
import { resetRedeemWizardAction } from "../../actions/redeem.actions";
import { toast } from "react-toastify";
import { StoreType, ParachainStatus } from "../../types/util.types";
import { showAccountModalAction } from "../../actions/general.actions";

type VaultTableProps = {
    isRelayer: boolean | undefined;
};

export default function VaultTable(props: VaultTableProps): ReactElement {
    const [vaults, setVaults] = useState<Array<Vault>>([]);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const { t } = useTranslation();
    const [showWizard, setShowWizard] = useState(false);
    const dispatch = useDispatch();
    const { address, extensions, btcRelayHeight,
        bitcoinHeight, stateOfBTCParachain } = useSelector((state: StoreType) => state.general);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const vaults = await window.polkaBTC.vaults.list();
            const vaultsList: Vault[] = [];
            vaults.forEach(async (vault, index) => {
                const accountId = window.polkaBTC.api.createType("AccountId", vault.id);
                let unsettledCollateralization: number | undefined = undefined;
                let settledCollateralization: number | undefined = undefined;
                try {
                    unsettledCollateralization = await window.polkaBTC.vaults.getVaultCollateralization(vault.id);
                    if (unsettledCollateralization !== undefined) {
                        unsettledCollateralization = convertToPercentage(unsettledCollateralization);
                    }
                    settledCollateralization = await window.polkaBTC.vaults.getVaultCollateralization(
                        vault.id,
                        undefined,
                        true
                    );
                    if (settledCollateralization !== undefined) {
                        settledCollateralization = convertToPercentage(settledCollateralization);
                    }
                } catch (error) {
                    // TODO: toast error?
                    console.log(error);
                }

                let btcAddress: string | undefined;
                try {
                    btcAddress = encodeBitcoinAddress(vault.wallet.address);
                } catch (error) {
                    // TODO: toast error?
                    console.log(error);
                }

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
                        vault.status && checkVaultStatus(vault.status.toString(), Number(unsettledCollateralization)),
                    unsettledCollateralization: unsettledCollateralization,
                    settledCollateralization: settledCollateralization,
                });
                if (index + 1 === vaults.length) setVaults(vaultsList);
            });
        };

        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, constants.COMPONENT_UPDATE_MS);
        return () => clearInterval(interval);
    }, [polkaBtcLoaded]);

    const checkVaultStatus = (status: string, collateralization: number): string => {
        if (status === constants.VAULT_STATUS_THEFT) {
            return constants.VAULT_STATUS_THEFT;
        }
        if (status === constants.VAULT_STATUS_LIQUIDATED) {
            return constants.VAULT_STATUS_LIQUIDATED;
        }
        if (collateralization < constants.VAULT_AUCTION_COLLATERALIZATION) {
            return constants.VAULT_STATUS_AUCTION;
        }
        if (collateralization < constants.VAULT_IDEAL_COLLATERALIZATION) {
            return constants.VAULT_STATUS_UNDECOLLATERALIZED;
        }
        return constants.VAULT_STATUS_ACTIVE;
    };

    const getStatusColor = (status: string): string => {
        if (status === constants.VAULT_STATUS_ACTIVE) {
            return "green-text";
        }
        if (status === constants.VAULT_STATUS_UNDECOLLATERALIZED) {
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

    const getCollateralizationColor = (collateralization: number | undefined): string => {
        if (typeof collateralization !== "undefined") {
            if (collateralization >= constants.VAULT_IDEAL_COLLATERALIZATION) {
                return "green-text";
            }
            if (collateralization >= constants.VAULT_AUCTION_COLLATERALIZATION) {
                return "yellow-text";
            }
            if (collateralization >= constants.VAULT_AUCTION_COLLATERALIZATION) {
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
        if (bitcoinHeight-btcRelayHeight>constants.BLOCKS_BEHIND_LIMIT) {
            toast.error(t("redeem_page.error_more_than_6_blocks_behind"));
            return;
        }
        if(address && extensions.length) {
            dispatch(updatePremiumVaultAction(vault));
            setShowWizard(true);
        } else {
            dispatch(showAccountModalAction(true));
        }
    }

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
                                    {!props.isRelayer && <th>Premium</th>}
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
                                                <td className={getStatusColor(vault.status)}>{vault.status}</td>
                                                {!props.isRelayer && <td>
                                                    <Button onClick={() => openRedeemWizard(vault)}>
                                                        {t("dashboard.premium_redeem")}
                                                    </Button>
                                                </td>}
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
