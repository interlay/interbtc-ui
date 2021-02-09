import React, { useState, useEffect, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";

import { defaultTableDisplayParams, shortAddress, formatDateTimePrecise } from "../../../common/utils/utils";
import { RelayedBlock } from "../../../common/types/util.types";
import DashboardTable from "../../../common/components/dashboard-table/dashboard-table";
import { getAccents } from "../dashboard-colors";
import BtcRelay from "../components/btc-relay";

export default function RelayDashboard(): ReactElement {
    const statsApi = usePolkabtcStats();
    const { t } = useTranslation();

    const [blocks, setBlocks] = useState(new Array<RelayedBlock>());
    const [totalRelayedBlocks, setTotalRelayedBlocks] = useState(0);
    const [tableParams, setTableParams] = useState(defaultTableDisplayParams());

    const fetchBlocks = useMemo(
        () => async () => {
            try {
                const [blocks, totalRelayedBlocks] = await Promise.all([
                    statsApi.getBlocks(tableParams.page, tableParams.perPage, tableParams.sortBy, tableParams.sortAsc),
                    statsApi.getTotalRelayedBlocksCount(),
                ]);
                setBlocks(blocks.data);
                setTotalRelayedBlocks(Number(totalRelayedBlocks.data));
            } catch (e) {
                console.error(e);
            }
        },
        [tableParams, statsApi]
    );

    const tableHeadings = [
        <h1>{t("dashboard.relay.block_height")}</h1>,
        <h1>{t("dashboard.relay.block_hash")}</h1>,
        <h1>{t("dashboard.relay.timestamp")}</h1>,
    ];

    const tableBlockRow = useMemo(
        () => (block: RelayedBlock): ReactElement[] => [
            <p>{block.height}</p>,
            <p>{shortAddress(block.hash)}</p>,
            <p>{formatDateTimePrecise(new Date(block.relay_ts))}</p>,
        ],
        []
    );

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks, tableParams]);

    return (
        <div className="dashboard-page">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div>
                        <div className="title-container">
                            <div
                                style={{ backgroundColor: getAccents("d_blue").color }}
                                className="issue-page-text-container"
                            >
                                <h1>{t("dashboard.relay.btcrelay")}</h1>
                            </div>
                            <div style={{ backgroundColor: getAccents("d_blue").color }} className="title-line"></div>
                        </div>
                        <div className="dashboard-graphs-container">
                            <div className="relay-grid-container">
                                <BtcRelay displayBlockstreamData={true} />
                            </div>
                        </div>
                        <div className="dashboard-table-container">
                            <div>
                                <p className="table-heading">{t("dashboard.relay.blocks")}</p>
                            </div>
                            <DashboardTable
                                richTable={true}
                                pageData={blocks.map((b) => ({ ...b, id: b.hash }))}
                                totalPages={Math.ceil(totalRelayedBlocks / tableParams.perPage)}
                                tableParams={tableParams}
                                setTableParams={setTableParams}
                                headings={tableHeadings}
                                dataPointDisplayer={tableBlockRow}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
