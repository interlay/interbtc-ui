import { planckToDOT } from "@interlay/polkabtc";
import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { StoreType } from "../../../common/types/util.types";
import * as constants from "../../../constants";
import { useTranslation } from "react-i18next";
import DashboardTable from "../../../common/components/dashboard-table/dashboard-table";

type StakedRelayer = {
    id: string;
    lockedDOT: string;
    status: string;
};

export default function StakedRelayerTable(): ReactElement {
    const isPolkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const [relayers, setRelayers] = useState<Array<StakedRelayer>>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            if (!isPolkaBtcLoaded) return;

            try {
                const relayers = await window.polkaBTC.stakedRelayer.map();
                const relayersList: StakedRelayer[] = [];
                relayers.forEach((stake, id) => {
                    relayersList.push({
                        id: id.toString(),
                        lockedDOT: planckToDOT(stake.stake.toString()),
                        // TODO: add a status check for relayers in the parachain
                        status: constants.STAKED_RELAYER_OK,
                    });
                });
                setRelayers(relayersList);
                // TODO: add status check for relayers on parachain
            } catch (error) {
                toast.error(error.toString());
            }
        };

        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, constants.COMPONENT_UPDATE_MS);
        return () => clearInterval(interval);
    }, [isPolkaBtcLoaded]);

    const getStatusColor = (status: string): string => {
        if (status === constants.STAKED_RELAYER_OK) {
            return "green-text";
        }
        if (status === constants.STAKED_RELAYER_OFFLINE) {
            return "orange-text";
        }
        if (status === constants.STAKED_RELAYER_SLASHED) {
            return "red-text";
        }
        return "black-text";
    };

    const tableHeadings = [<h1>{t("account_id")}</h1>, <h1>{t("locked_dot")}</h1>, <h1>{t("status")}</h1>];

    const relayersTableRow = (relayer: StakedRelayer): ReactElement[] => [
        <p className="break-words">{relayer.id}</p>,
        <p>{relayer.lockedDOT}</p>,
        <p className={getStatusColor(relayer.status)}>{relayer.status}</p>,
    ];

    return (
        <div className="dashboard-table-container">
            <div>
                <p className="table-heading">{t("dashboard.parachain.relayers")}</p>
            </div>
            <DashboardTable
                pageData={relayers}
                headings={tableHeadings}
                dataPointDisplayer={relayersTableRow}
                noDataEl={<td colSpan={3}>{t("dashboard.no-registered")}</td>}
            />
        </div>
    );
}
