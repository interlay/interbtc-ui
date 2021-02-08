import { ReactElement, useMemo } from "react";
import React from "react";
import { TableDisplayParams } from "../../types/util.types";
import { useTranslation } from "react-i18next";
import Icon_external_link from "../../../assets/img/icons/Icon-external-link.svg";
import { getAccents } from "../../../pages/dashboard/dashboard-colors";
import Icon_confirm from "../../../assets/img/icons/Icon_confirm.svg";
import Icon_cancel from "../../../assets/img/icons/Icon_cancel.svg";
import Icon_pending from "../../../assets/img/icons/Icon_pending.svg";
import TablePageSelector from "../table-page-selector/table-page-selector";

const blue_accent = getAccents("d_blue");

/**
 * Helper component to display a blue link with icon.
 **/
type StyledLinkDataProps = {
    data: string;
    target?: string;
};
export function StyledLinkData(props: StyledLinkDataProps): ReactElement {
    //TODO: make into actual hyperlink
    return (
        <>
            <p style={{ color: blue_accent.color }}>{props.data}</p>
            <img
                style={{
                    filter: blue_accent.filter,
                }}
                className="external-link"
                src={Icon_external_link}
                alt=""
            />
        </>
    );
}

type StatusComponentProps = {
    status: "pending" | "completed" | "cancelled" | "expired" | "reimbursed";
};
export function StatusComponent({ status }: StatusComponentProps): ReactElement {
    const { t } = useTranslation();
    const icon = ["completed", "reimbursed"].includes(status)
        ? Icon_confirm
        : ["cancelled", "expired"].includes(status)
        ? Icon_cancel
        : Icon_pending;
    const color = ["completed", "reimbursed"].includes(status)
        ? "d_green"
        : ["cancelled", "expired"].includes(status)
        ? "d_red"
        : "d_yellow";
    const text = t(status);
    return (
        <div className="status-container">
            <img className="external-link" src={icon} alt="" />
            <p style={{ color: getAccents(color).color }} className="status">
                {text}
            </p>
        </div>
    );
}

type DataWithID = { id: string };
type DashboardTableProps<D extends DataWithID> = {
    pageData: D[];
    totalPages: number;
    tableParams: TableDisplayParams;
    setTableParams: (params: TableDisplayParams) => void;
    headings: string[];
    dataPointDisplayer: (dataPoint: D) => ReactElement[];
};

export default function DashboardTable<D extends DataWithID>({
    pageData,
    totalPages,
    tableParams,
    setTableParams,
    headings,
    dataPointDisplayer,
}: DashboardTableProps<D>): ReactElement {
    const { t } = useTranslation();

    const setPage = useMemo(() => (page: number) => setTableParams({ ...tableParams, page }), [
        setTableParams,
        tableParams,
    ]);

    return pageData.length > 0 ? (
        <div className="dashboard-table">
            <div className="dashboard-table-grid">
                {headings.map((heading, i) => (
                    <div style={{ gridColumn: i + 1 }}>
                        <div className="line"></div>
                        <div className="data-container">
                            <h1>{heading}</h1>
                        </div>
                        <div className="line"></div>
                        {pageData.map((point) => (
                            <div>
                                <div className="data-container">{dataPointDisplayer(point)[i]}</div>
                                <div className="line"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {totalPages > 1 ? (
                <TablePageSelector totalPages={totalPages} currentPage={tableParams.page} setPage={setPage} />
            ) : (
                ""
            )}
        </div>
    ) : (
        <div>{t("empty_data")}</div>
    );
}
