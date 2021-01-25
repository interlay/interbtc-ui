import { useMemo } from "react";
import * as polkabtcStats from "@interlay/polkabtc-stats";
import { STATS_URL } from "../../constants";

export default function usePolkabtcStats(): polkabtcStats.StatsApi {
    const statsApi = useMemo(
        () => new polkabtcStats.StatsApi(new polkabtcStats.Configuration({ basePath: STATS_URL })),
        []
    );

    return statsApi;
}
