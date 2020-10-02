import React, { ReactElement, useState, useEffect } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector, useDispatch } from "react-redux";
import { Vault } from "../../../common/types/util.types";
import { fetchPrices } from "../../../common/api/api";

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
                    collateralization = await polkaBTC.vaults.getCollateralization(
                        vault.id
                    );
                    // convert into percentage
                    collateralization = collateralization * 100;
                } catch (error) {
                    console.log(error);
                }

                vaultsList.push({
                    vaultId: accountId.toString(),
                    // TODO: fetch collateral reserved
                    lockedBTC: vault.issued_tokens,
                    lockedDOT: 0,
                    btcAddress: vault.btc_address.toString().substr(2),
                    status: vault.status && vault.status.toString(),
                    collateralization: collateralization
                });
                if (index + 1 === vaults.length) setVaults(vaultsList);
            });
        };
        fetchData();
    }, [polkaBTC, prices]);

    const getStatusColor = (status: string): string => {
        if (status === "Active") {
            return "green-text";
        }
        if (status === "Theft") {
            return "orange-text";
        }
        return "red-text";
    };

    const getCollateralizationColor = (collateralization: number | undefined): string => {
        if (typeof collateralization !== "undefined") {
            if (collateralization >= 200) {
                return "green-text";
            }
            if (collateralization >= 150 && collateralization < 200) {
                return "yellow-text";
            }
            if (collateralization > 120 && collateralization < 150) {
                return "orange-text";
            }
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
                                            <td>{vault.lockedBTC.toString()}</td>
                                            <td
                                                className={getCollateralizationColor(
                                                    vault.collateralization
                                                )}
                                            >
                                                {typeof vault.collateralization !== "undefined"? vault.collateralization.toString() + "%" : "N/A"}
                      </td>
                                            <td className={getStatusColor(vault.status)}>
                                                {vault.status}
                                            </td>
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
