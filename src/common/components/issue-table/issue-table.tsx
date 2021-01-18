import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "react-bootstrap";
import { IssueRequest } from "../../../common/types/issue.types";
import React from "react";

export default function IssueTable({ issueRequests }: { issueRequests: IssueRequest[] }): ReactElement {
    const { t } = useTranslation();

    return (
        <Table>
            <thead>
                <tr>
                    <th>{t("id")}</th>
                    <th>{t("issue_page.amount")}</th>
                    <th>{t("issue_page.parachain_block")}</th>
                    <th>{t("issue_page.vault_dot_address")}</th>
                    <th>{t("issue_page.vault_btc_address")}</th>
                    <th>{t("issue_page.btc_transaction")}</th>
                    <th>{t("issue_page.confirmations")}</th>
                    <th>{t("status")}</th>
                </tr>
            </thead>
            <tbody>
                {issueRequests.map((ireq) => {
                    return (
                        <>
                            <td>{ireq.id}</td>
                            <td>{ireq.amountBTC}</td>
                            <td>{ireq.transactionBlockHeight}</td>
                            <td>{ireq.vaultDOTAddress}</td>
                            <td>{ireq.vaultBTCAddress}</td>
                            <td>{ireq.btcTxId}</td>
                            <td>{ireq.confirmations}</td>
                            <td>{ireq.completed ? t("completed") : ireq.cancelled ? t("cancelled") : t("pending")}</td>
                        </>
                    );
                })}
            </tbody>
        </Table>
    );
}
