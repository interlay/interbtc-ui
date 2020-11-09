import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { addReplaceRequestsAction } from "../../../common/actions/vault.actions";
import { Button } from "react-bootstrap";
import { requestsToVaultReplaceRequests } from "../../../common/utils/utils";
import { satToBTC, planckToDOT } from "@interlay/polkabtc";
import BN from "bn.js";

type ReplaceTableProps = {
    openModal: (show: boolean) => void;
};

export default function ReplaceTable(props: ReplaceTableProps): ReactElement {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const dispatch = useDispatch();
    const replaceRequests = useSelector((state: StoreType) => state.vault.requests);
    const [polkaBTCAmount, setPolkaBTCamount] = useState(new BN("0"));
    
    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const accountId = await window.vaultClient.getAccountId();
            const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
            const issuedPolkaBTCAmount = await window.polkaBTC.vaults.getIssuedPolkaBTCAmount(vaultId);
            setPolkaBTCamount(issuedPolkaBTCAmount.toBn());
            const requestsMap = await window.polkaBTC.vaults.mapReplaceRequests(vaultId);
            const requests = requestsMap.get(vaultId);
            if (!requests) return;

            dispatch(addReplaceRequestsAction(requestsToVaultReplaceRequests(requests)));
        };
        fetchData();
    }, [polkaBtcLoaded, dispatch]);

    return (
        <div className="replace-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">Replace Requests</div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Timestamp</th>
                                    <th>User</th>
                                    <th>BTC Address</th>
                                    <th>PolkaBTC</th>
                                    <th>LockedDOT</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {replaceRequests.map((redeem, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{redeem.id}</td>
                                            <td>{redeem.timestamp}</td>
                                            <td>{redeem.vault}</td>
                                            <td>{redeem.btcAddress}</td>
                                            <td>{satToBTC(redeem.polkaBTC)}</td>
                                            <td>{planckToDOT(redeem.lockedDOT)}</td>
                                            <td>{redeem.status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {polkaBTCAmount > new BN(0) ? (
                        <Button
                            variant="outline-danger"
                            className="vault-dashboard-button"
                            onClick={() => props.openModal(true)}
                        >
                            Replace My Vault
                        </Button>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}
