import React, { ReactElement, useState, useMemo, useEffect } from "react";
import { defaultBlockData } from "../../../utils/utils";
import usePolkabtcStats from "../../../hooks/use-polkabtc-stats";
import { useSelector } from "react-redux";
import { StoreType } from "../../../types/util.types";

enum Status {
    Online,
    Behind,
    NoData,
}

type RelayStatusChartProps = {
    displayBlockstreamData?: boolean;
};

export default function RelayStatusChart(props: RelayStatusChartProps): ReactElement {
    const statsApi = usePolkabtcStats();
    const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const [latestRelayBlock, setLatestRelayBlock] = useState(defaultBlockData());
    const [latestBlockstreamBlock, setLatestBlockstreamBlock] = useState({ height: 0, hash: "" });
    const [relayStatus, setRelayStatus] = useState(Status.Online);

    const fetchLatestRelayBlock = useMemo(
        () => async () => {
            const res = await statsApi.getBlocks(0, 1);
            setLatestRelayBlock(res.data[0]);
        },
        [statsApi] // to silence the compiler
    );

    const fetchLatestBlockstreamBlock = useMemo(
        () => async () => {
            const height = await window.polkaBTC.btcCore.getLatestBlockHeight();
            const hash = await window.polkaBTC.btcCore.getLatestBlock();
            setLatestBlockstreamBlock({ height, hash });
        },
        []
    );

    useEffect(() => {
        fetchLatestRelayBlock();
        if (polkaBtcLoaded) fetchLatestBlockstreamBlock();
    }, [polkaBtcLoaded, fetchLatestRelayBlock, fetchLatestBlockstreamBlock]);

    useEffect(() => {
        setRelayStatus(Number(latestRelayBlock.height) < latestBlockstreamBlock.height ? Status.Behind : Status.Online);
    }, [latestRelayBlock, latestBlockstreamBlock]);

    return (
        <>
            <div>
                <p>
                    Placeholder. Latest block: {latestRelayBlock.height} with hash {latestRelayBlock.hash}. Status:{" "}
                    {(() => {
                        switch (relayStatus) {
                            case Status.Online:
                                return "Online";
                            case Status.Behind:
                                return `${
                                    latestBlockstreamBlock.height - Number(latestRelayBlock.height)
                                } blocks behind`;
                            case Status.NoData:
                                return "No data";
                        }
                    })()}
                </p>
            </div>
            {props.displayBlockstreamData ? (
                <div>
                    Placeholder for blockstream data. Latest blockstream block: {latestBlockstreamBlock.height} with
                    hash {latestBlockstreamBlock.hash}.
                </div>
            ) : (
                ""
            )}
        </>
    );
}
