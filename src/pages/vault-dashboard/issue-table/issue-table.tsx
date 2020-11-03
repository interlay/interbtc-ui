import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { addVaultIssuesAction } from "../../../common/actions/issue.actions";
import { Vault, IssueRequest } from "@interlay/polkabtc/build/interfaces/default";
import { issueRequestToVaultIssue } from "../../../common/utils/utils";


export default function IssueTable(): ReactElement {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const issues = useSelector((state: StoreType) => state.issue.vaultIssues);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchData = async () => {
            if(!polkaBtcLoaded){
                if(!polkaBtcLoaded) return;
                let list = (await window.polkaBTC.vaults.list()) as Vault[];
                let allIssues: IssueRequest[]= [];
                list.forEach(async (vault) => {
                    const vaultId = window.polkaBTC.api.createType("AccountId",vault.id.toHuman());
                    const issuesMap = await window.polkaBTC.vaults.mapIssueRequests(vaultId);
                    const issues = issuesMap.get(vaultId);
                    if (!issues) return;
                    allIssues = [...allIssues,...issues];
                });
                dispatch(addVaultIssuesAction(issueRequestToVaultIssue(allIssues)));
            }
        };
        fetchData();
    }, [polkaBtcLoaded, dispatch]);

    return (
        <div className="issue-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        Issue
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
                                {issues.map((issue, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{issue.id}</td>
                                            <td>{issue.timestamp}</td>
                                            <td>{issue.user}</td>
                                            <td>{issue.btcAddress}</td>
                                            <td>{issue.polkaBTC}</td>
                                            <td>{issue.lockedDOT}</td>
                                            <td>{issue.status}</td>
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
