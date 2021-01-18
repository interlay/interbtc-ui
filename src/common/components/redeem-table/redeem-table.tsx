import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "react-bootstrap";
import { RedeemRequest } from "../../../common/types/redeem.types";
import React from "react";

export default function RedeemTable({ redeemRequests }: { redeemRequests: RedeemRequest[] }): ReactElement {
    const { t } = useTranslation();

    return (
        <Table>
            <thead>
                <tr>
                    <th>{t("id")}</th>
                    <th>{t("redeem_page.amount")}</th>
                    <th>{t("parachainblock")}</th>
                    <th>{t("issue_page.vault_dot_address")}</th>
                    <th>{t("redeem_page.output_BTC_address")}</th>
                    <th>{t("redeem_page.BTC_transaction")}</th>
                    <th>{t("redeem_page.confirmations")}</th>
                    <th>{t("status")}</th>
                </tr>
            </thead>
            <tbody>
                {redeemRequests.map((rreq) => {
                    return (
                        <>
                            <td>{rreq.id}</td>
                            <td>{rreq.amountPolkaBTC}</td>
                            <td>{rreq.transactionBlockHeight}</td>
                            <td>{rreq.vaultDotAddress}</td>
                            <td>{rreq.btcAddress}</td>
                            <td>{rreq.btcTxId}</td>
                            <td>{rreq.confirmations}</td>
                            <td>
                                {rreq.completed
                                    ? t("completed")
                                    : rreq.cancelled
                                    ? t("cancelled")
                                    : rreq.isExpired
                                    ? t("expired")
                                    : rreq.reimbursed
                                    ? t("reimbursed")
                                    : t("pending")}
                            </td>
                        </>
                    );
                })}
            </tbody>
        </Table>
    );
}
