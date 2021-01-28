import { ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "react-bootstrap";
import { IssueRequest } from "../../../../common/types/issue.types";
import React from "react";
import { TableDisplayParams } from "../../../../common/types/util.types";
import TablePageSelector from "../../../../common/components/table-page-selector/table-page-selector";

type IssueTableProps = {
    issueRequests: IssueRequest[];
    tableParams: TableDisplayParams;
    setTableParams: (params: TableDisplayParams) => void;
};

export default function IssueTable({ issueRequests, tableParams, setTableParams }: IssueTableProps): ReactElement {
    const { t } = useTranslation();

    const totalPages = useMemo(() => Math.ceil(issueRequests.length / tableParams.perPage), [
        issueRequests,
        tableParams,
    ]);
    const setPage = useMemo(() => (page: number) => setTableParams({ ...tableParams, page }), [
        setTableParams,
        tableParams,
    ]);

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>{t("id")}</th>
                        <th>{t("issue_page.amount")}</th>
                        <th>{t("issue_page.parachain_block")}</th>
                        <th>{t("issue_page.vault_dot_address")}</th>
                        <th>{t("issue_page.vault_btc_address")}</th>
                        <th>{t("issue_page.confirmations")}</th>
                        <th>{t("status")}</th>
                    </tr>
                </thead>
                <tbody>
                    {issueRequests.map((ireq) => {
                        return (
                            <tr key={ireq.id}>
                                <td>{ireq.id}</td>
                                <td>{ireq.amountBTC}</td>
                                <td>{ireq.creation}</td>
                                <td>{ireq.vaultDOTAddress}</td>
                                <td>{ireq.vaultBTCAddress}</td>
                                <td>{ireq.confirmations}</td>
                                <td>
                                    {ireq.completed ? t("completed") : ireq.cancelled ? t("cancelled") : t("pending")}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <TablePageSelector totalPages={totalPages} currentPage={tableParams.page} setPage={setPage} />
        </>
    );
}
