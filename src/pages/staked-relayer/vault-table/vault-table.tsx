import React, { ReactElement, useState, useEffect } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector, useDispatch } from "react-redux";
import { Vault } from "../../../common/types/util.types";
import { fetchPrices } from "../../../common/api/api";
import * as constants from "../../../constants";
import * as bitcoin from "bitcoinjs-lib";
import { planckToDOT, satToBTC } from "@interlay/polkabtc";

export default function VaultTable(): ReactElement {
    const [vaults, setVaults] = useState<Array<Vault>>([]);
    const prices = useSelector((state: StoreType) => state.prices);
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            fetchPrices(dispatch);
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBTC || !prices) return;

            let vaults = await polkaBTC.vaults.list();
            let vaultsList: Vault[] = [];
            vaults.forEach(async (vault, index) => {
                const accountId = polkaBTC.api.createType("AccountId", vault.id);
                let collateralization: number | undefined = undefined;

                try {
                    collateralization = await polkaBTC.vaults.getCollateralization(vault.id);
                    // convert into percentage
                    collateralization = collateralization * 100;
                } catch (error) {
                    console.log(error);
                }

                let btcAddress: string | undefined;
                try {
                    // TODO: specify script format in parachain
                    const payment = bitcoin.payments.p2wpkh({
                        hash: Buffer.from(vault.btc_address.buffer),
                        network: bitcoin.networks.testnet,
                    });
                    btcAddress = payment.address;
                } catch (error) {
                    console.log(error);
                }

                const balanceLockedPlanck = await polkaBTC.collateral.balanceLockedDOT(accountId);
                const balanceLockedDOT = planckToDOT(balanceLockedPlanck.toString()); 

                vaultsList.push({
                    vaultId: accountId.toString(),
                    // TODO: fetch collateral reserved
                    lockedBTC: satToBTC(vault.issued_tokens.toString()),
                    lockedDOT: balanceLockedDOT,
                    btcAddress,
                    status: vault.status && checkVaultStatus(vault.status.toString(), Number(collateralization)),
                    collateralization: collateralization,
                });
                if (index + 1 === vaults.length) setVaults(vaultsList);
            });
        };
        fetchData();
    }, [polkaBTC, prices]);

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
                                    <th>Collateralization</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaults.map((vault, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{vault.vaultId}</td>
                                            <td className="break-words">{vault.btcAddress}</td>
                                            <td>{vault.lockedDOT}</td>
                                            <td>{vault.lockedBTC}</td>
                                            <td className={getCollateralizationColor(vault.collateralization)}>
                                                {typeof vault.collateralization !== "undefined"
                                                    ? vault.collateralization.toString() + "%"
                                                    : "∞"}
                                            </td>
                                            <td className={getStatusColor(vault.status)}>{vault.status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
