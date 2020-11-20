import React, { ReactElement, useState, useEffect } from "react";
import { StoreType } from "../../types/util.types";
import { useSelector } from "react-redux";
import { Vault } from "../../types/util.types";
import * as constants from "../../../constants";
import { planckToDOT, satToBTC, roundTwoDecimals } from "@interlay/polkabtc";
import { getAddressFromH160, shortAddress } from "../../utils/utils";
import BitcoinAddress from "../bitcoin-links/address";

export default function VaultTable(): ReactElement {
    const [vaults, setVaults] = useState<Array<Vault>>([]);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const vaults = await window.polkaBTC.vaults.list();
            const vaultsList: Vault[] = [];
            vaults.forEach(async (vault, index) => {
                const accountId = window.polkaBTC.api.createType("AccountId", vault.id);
                let collateralization: number | undefined = undefined;
                try {
                    collateralization = await window.polkaBTC.vaults.getVaultCollateralization(vault.id);
                    if (collateralization !== undefined) {
                        // convert into percentage
                        collateralization = collateralization * 100;
                    }
                } catch (error) {
                    console.log(error);
                }

                let btcAddress: string | undefined;
                try {
                    btcAddress = getAddressFromH160(vault.wallet.address);
                    if (btcAddress === undefined) {
                        throw new Error("Vault has invalid BTC address.");
                    }
                } catch (error) {
                    console.log(error);
                }

                const balanceLockedPlanck = await window.polkaBTC.collateral.balanceLockedDOT(accountId);
                const balanceLockedDOT = planckToDOT(balanceLockedPlanck.toString());
                debugger;

                vaultsList.push({
                    vaultId: accountId.toString(),
                    // TODO: fetch collateral reserved
                    lockedBTC: satToBTC(vault.issued_tokens.toString()),
                    lockedDOT: balanceLockedDOT,
                    pendingBTC: satToBTC(vault.to_be_issued_tokens.toString()),
                    btcAddress: btcAddress || "",
                    status: vault.status && checkVaultStatus(vault.status.toString(), Number(collateralization)),
                    collateralization: collateralization,
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
                                        <i className="far fa-question-circle" 
                                           data-tip="BTC volume of in-progress issue requests.">
                                        </i> 
                                    </th>
                                    <th>
                                        Collateralization  &nbsp;
                                        <i className="far fa-question-circle" 
                                           data-tip="Overall collateralization, including pending issue requests.
                                           'real' value shows collateralization for actually locked BTC">
                                        </i> 
                                    </th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {vaults && vaults.length
                                ?
                                <tbody>
                                    {vaults.map((vault, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{shortAddress(vault.vaultId)}</td>
                                                <td className="break-words">
                                                    <BitcoinAddress btcAddress={vault.btcAddress} />
                                                </td>
                                                <td>{vault.lockedDOT}</td>
                                                <td>{vault.lockedBTC}</td>
                                                <td>{vault.pendingBTC}</td>
                                                <td className={getCollateralizationColor(vault.collateralization)}>
                                                    {typeof vault.collateralization !== "undefined"
                                                        ? roundTwoDecimals(vault.collateralization.toString()) + "%"
                                                        : "∞"}
                                                </td>
                                                <td className={getStatusColor(vault.status)}>{vault.status}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                : 
                                <tbody>
                                    <tr>
                                        <td colSpan={6}>
                                            No registered vaults
                                    </td>
                                    </tr>
                                </tbody>
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
