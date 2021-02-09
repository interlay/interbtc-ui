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

/**
 * Helper component to display status text, with appropriate colour and status icon
 **/
type StatusComponentProps = {
    text: string;
    category: "bad" | "warning" | "ok";
};
export function StatusComponent({ text, category }: StatusComponentProps): ReactElement {
    const icon = category === "ok" ? Icon_confirm : category === "bad" ? Icon_cancel : Icon_pending;
    const color = category === "ok" ? "d_green" : category === "bad" ? "d_red" : "d_yellow";
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
type SimpleDashboardTableProps<D extends DataWithID> = {
    richTable?: false;
    pageData: D[];
    headings: ReactElement[];
    dataPointDisplayer: (dataPoint: D) => ReactElement[];
    noDataEl?: ReactElement;
};
type RichDashboardTableProps<D extends DataWithID> = {
    richTable: true;
    pageData: D[];
    totalPages: number;
    tableParams: TableDisplayParams;
    setTableParams: (params: TableDisplayParams) => void;
    headings: ReactElement[];
    dataPointDisplayer: (dataPoint: D) => ReactElement[];
    noDataEl?: ReactElement;
};

type DashboardTableProps<D extends DataWithID> = SimpleDashboardTableProps<D> | RichDashboardTableProps<D>;

export default function DashboardTable<D extends DataWithID>(props: DashboardTableProps<D>): ReactElement {
    const { t } = useTranslation();

    const setPage = useMemo(
        () => (page: number) => (props.richTable ? props.setTableParams({ ...props.tableParams, page }) : undefined),
        [props]
    );

    return props.pageData.length > 0 ? (
        <div className="dashboard-table">
            <div className="dashboard-table-grid">
                {props.headings.map((heading, i) => (
                    <div style={{ gridColumn: i + 1 }}>
                        <div className="line"></div>
                        <div className="data-container">{heading}</div>
                        <div className="line"></div>
                        {props.pageData.map((point) => (
                            <div>
                                <div className="data-container">{props.dataPointDisplayer(point)[i]}</div>
                                <div className="line"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {props.richTable ? (
                <TablePageSelector
                    totalPages={props.totalPages}
                    currentPage={props.tableParams.page}
                    setPage={setPage}
                />
            ) : (
                ""
            )}
        </div>
    ) : props.noDataEl !== undefined ? (
        props.noDataEl
    ) : (
        <div>{t("empty_data")}</div>
    );
}
