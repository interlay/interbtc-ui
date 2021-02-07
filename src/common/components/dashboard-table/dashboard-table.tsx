import { ReactElement, useMemo } from "react";
import React from "react";
import { TableDisplayParams } from "../../types/util.types";
import { useTranslation } from "react-i18next";
import Icon_external_link from "../../../assets/img/icons/Icon-external-link.svg";
import { getAccents } from "../../../pages/dashboard/dashboard-colors";
import Icon_confirm from "../../../assets/img/icons/Icon_confirm.svg";
import Icon_cancel from "../../../assets/img/icons/Icon_cancel.svg";
import Icon_pending from "../../../assets/img/icons/Icon_pending.svg";
import { shortAddress } from "../../utils/utils";
type DataWithID = { id: string };
const blue_accent = getAccents("d_blue");
type DashboardTableProps<D extends DataWithID> = {
    pageData: D[];
    totalPages: number;
    tableParams: TableDisplayParams;
    setTableParams: (params: TableDisplayParams) => void;
    headings: string[];
    dataPointDisplayer: (dataPoint: D) => string[];
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
    console.log("data is", pageData);
    return pageData.length > 0 ? (
        <div className="table">
            <div className="issue-redeem-table-grid">
                <div id="date">
                    <div className="line"></div>
                    <div className="data-container">
                        <h1>{t("date")}</h1>
                    </div>
                    <div className="line"></div>
                    {pageData.map((point) => (
                        <div>
                            <div className="data-container">
                                <p>{dataPointDisplayer(point)[1].substring(0, 9)}</p>
                            </div>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
                <div id="amount">
                    <div className="line"></div>
                    <div className="data-container">
                        <h1>{t("issue_page.amount")}</h1>
                    </div>
                    <div className="line"></div>
                    {pageData.map((point) => (
                        <div>
                            <div className="data-container">
                                <p>{dataPointDisplayer(point)[2]}</p>
                            </div>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
                <div id="parachain-block">
                    <div className="line"></div>
                    <div className="data-container">
                        <h1>{t("issue_page.parachain_block")}</h1>
                    </div>
                    <div className="line"></div>
                    {pageData.map((point) => (
                        <div>
                            <div className="data-container">
                                <p>{dataPointDisplayer(point)[3]}</p>
                            </div>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
                <div id="vault-address">
                    <div className="line"></div>
                    <div className="data-container">
                        <h1>{t("issue_page.vault_dot_address")}</h1>
                    </div>
                    <div className="line"></div>
                    {pageData.map((point) => (
                        <div>
                            <div className="data-container">
                                <p style={{ color: `${blue_accent.color}` }}>
                                    {shortAddress(dataPointDisplayer(point)[4])}
                                </p>
                                <img
                                    style={{
                                        filter: `${blue_accent.filter}`,
                                    }}
                                    className="external-link"
                                    src={Icon_external_link}
                                    alt=""
                                />
                            </div>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
                <div id="vault-btc-address">
                    <div className="line"></div>
                    <div className="data-container">
                        <h1>{t("issue_page.vault_btc_address")}</h1>
                    </div>
                    <div className="line"></div>
                    {pageData.map((point) => (
                        <div>
                            <div className="data-container">
                                <p style={{ color: `${blue_accent.color}` }}>
                                    {shortAddress(dataPointDisplayer(point)[5])}
                                </p>
                                <img
                                    style={{
                                        filter: `${blue_accent.filter}`,
                                    }}
                                    className="external-link"
                                    src={Icon_external_link}
                                    alt=""
                                />
                            </div>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
                <div id="btc-transaction">
                    <div className="line"></div>
                    <div className="data-container">
                        <h1>BTC Transaction</h1>
                    </div>
                    <div className="line"></div>
                    {pageData.map((point) => (
                        <div>
                            <div className="data-container">
                                <p>No data</p>
                                {/* <img
                                style={{
                                    filter: `${blue_accent.filter}`,
                                }}
                                className="external-link"
                                src={Icon_external_link}
                                alt=""
                            /> */}
                            </div>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
                <div id="btc-confirmation">
                    <div className="line"></div>
                    <div className="data-container">
                        <h1>{t("redeem_page.btc_confirmations")}</h1>
                    </div>
                    <div className="line"></div>
                    {pageData.map((point) => (
                        <div>
                            <div className="data-container">
                                <p>No data</p>
                            </div>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
                <div id="status">
                    <div className="line"></div>
                    <div className="data-container">
                        <h1>{t("status")}</h1>
                    </div>
                    <div className="line"></div>
                    {pageData.map((point) => (
                        <div>
                            <div className="data-container">
                                {dataPointDisplayer(point)[6] === "Completed" ? (
                                    <div className="status-container">
                                        <img className="external-link" src={Icon_confirm} alt="" />
                                        <p style={{ color: getAccents("d_green").color }} className="status">
                                            {t("issue_page.executed")}
                                        </p>
                                    </div>
                                ) : dataPointDisplayer(point)[5] === "Cancelled" ? (
                                    <div className="status-container">
                                        <img className="external-link" src={Icon_cancel} alt="" />
                                        <p style={{ color: getAccents("d_red").color }} className="status">
                                            {t("issuepage.cancelled")}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="status-container">
                                        <img className="external-link" src={Icon_pending} alt="" />
                                        <p style={{ color: getAccents("d_yellow").color }} className="status">
                                            {t("issue_page.pending")}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <TablePageSelector totalPages={totalPages} currentPage={tableParams.page} setPage={setPage} /> */}
        </div>
    ) : (
        <div>{t("empty_data")}</div>
    );
}
