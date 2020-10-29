import React, { ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { addReplaceRequestsAction } from "../../../common/actions/replace.actions";

export default function ReplaceTable(): ReactElement {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const dispatch = useDispatch();
    const replaceRequests = useSelector((state: StoreType) => state.replace.requests);

    useEffect(() => {
        const fetchData = async () => {
            if(!polkaBtcLoaded){
                // TO DO FETCH REDEEMS AND STORE THEM IN STORE
                dispatch(addReplaceRequestsAction([]));
            }
        };
        fetchData();
    }, [polkaBtcLoaded]);

    return (
        <div className="replace-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        Replace Requests
                    </div>
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
                                    <th>BTC Address(es)</th>
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
                                            <td>{redeem.polkaBTC}</td>
                                            <td>{redeem.lockedDOT}</td>
                                            <td>{redeem.status}</td>
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
