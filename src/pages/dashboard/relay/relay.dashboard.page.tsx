import React, { useState, useEffect, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";

import RelayStatusChart from "../../../common/components/charts/relay-blocks/relay-status-chart";
import { defaultTableDisplayParams } from "../../../common/utils/utils";
import { RelayedBlock } from "../../../common/types/util.types";
import DashboardTable from "../../../common/components/dashboard-table/dashboard-table";

export default function RelayDashboard(): ReactElement {
    const statsApi = usePolkabtcStats();
    const { t } = useTranslation();

    const [blocks, setBlocks] = useState(new Array<RelayedBlock>());
    const [tableParams, setTableParams] = useState(defaultTableDisplayParams());

    const fetchBlocks = useMemo(
        () => async () => {
            const res = await statsApi.getBlocks(
                tableParams.page,
                tableParams.perPage,
                tableParams.sortBy,
                tableParams.sortAsc
            );
            setBlocks(res.data);
        },
        [tableParams, statsApi]
    );

    const tableHeadings = [
        t("dashboard.relay.block_height"),
        t("dashboard.relay.block_hash"),
        t("dashboard.relay.timestamp"),
    ];

    const tableBlockRow = useMemo(() => (block: RelayedBlock) => [block.height, block.hash, block.relay_ts], []);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks, tableParams]);

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">{t("dashboard.issues")}</div>
                    </div>
                    <div className="row mt-5 mb-3">
                        <div className="col-lg-8 offset-2">
                            <div className="row">
                                <RelayStatusChart displayBlockstreamData={true} />
                            </div>
                        </div>
                    </div>
                    <DashboardTable
                        data={blocks.map((b) => ({ ...b, id: b.hash }))}
                        tableParams={tableParams}
                        setTableParams={setTableParams}
                        headings={tableHeadings}
                        dataPointDisplayer={tableBlockRow}
                    />
                </div>
            </div>
        </div>
    );
}
