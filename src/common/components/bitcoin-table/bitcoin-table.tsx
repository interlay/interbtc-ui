import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";
import * as constants from "../../../constants";
import * as utils from "../../utils/utils";

interface BlockInfo {
    source: string;
    height: string;
    hash: string;
}

export default function BitcoinTable(): ReactElement {
    const [relayStatus, setStatus] = useState("Online");
    const [fork, setFork] = useState(false);
    const [noData, setNoData] = useState(false);
    const [heightDiff, setHeightDiff] = useState(0);
    const [btcBlocks, setBlocks] = useState<Array<BlockInfo>>([]);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            // Returns a little endian encoded block hash
            // Converting to big endian for display
            const bestParachainBlock = utils.uint8ArrayToStringClean(
                utils.reverseEndianness(await window.polkaBTC.btcRelay.getLatestBlock())
            );

            const bestParachainHeight = Number(await window.polkaBTC.btcRelay.getLatestBlockHeight());

            let bestBitcoinBlock = "-";
            let bestBitcoinHeight = 0;

            try {
                // Returns a big endian encoded block hash
                bestBitcoinBlock = await window.polkaBTC.btcCore.getLatestBlock();
                bestBitcoinHeight = await window.polkaBTC.btcCore.getLatestBlockHeight();
            } catch (error) {
                // network error
            }

            // Check for NO_DATA, forks and height difference
            setNoData(bestBitcoinBlock !== bestParachainBlock && bestBitcoinHeight < bestParachainHeight);

            setFork(bestBitcoinBlock !== bestParachainBlock && bestBitcoinHeight <= bestParachainHeight);
            setHeightDiff(bestBitcoinHeight - bestParachainHeight);

            setStatus(getRelayStatus());
            // parseInt((bestParachainBlock).toString(16).replace(/^(.(..)*)$/, "0$1").match(/../g).reverse().join(""), 16)
            setBlocks([
                {
                    source: "BTC Parachain",
                    hash: bestParachainBlock,
                    height: bestParachainHeight.toString(),
                },
                {
                    source: "Bitcoin Core",
                    hash: bestBitcoinBlock,
                    height: bestBitcoinHeight.toString(),
                },
            ]);
        };
        fetchData();

        /**
         * Checks for BTC-Relay status.
         * TODO: check parachain for invalid state
         * TODO: check parachain for ongoing fork
         */
        const getRelayStatus = (): string => {
            let status = "Online";
            if (noData) {
                status = "Unknown header";
            }
            if (fork) {
                status = "Fork";
            }
            if (heightDiff > constants.BTC_RELAY_DELAY_CRITICAL) {
                status = "More than " + constants.BTC_RELAY_DELAY_CRITICAL + " blocks behind.";
            }
            return status;
        };
    }, [polkaBtcLoaded, noData, fork, heightDiff]);

    const getCircle = (status: string): string => {
        if (status === "Online") {
            return "green-circle";
        }
        if (status === "Fork") {
            return "orange-circle";
        }
        return "red-circle";
    };

    const getHeightColor = (): string => {
        if (Math.abs(heightDiff) > constants.BTC_RELAY_DELAY_CRITICAL) {
            return "red-text";
        }
        if (Math.abs(heightDiff) > constants.BTC_RELAY_DELAY_WARNING) {
            return "orange-text";
        }
        return "";
    };

    return (
        <div className="bitcoin-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        Bitcoin Relay Status: &nbsp; <div className={getCircle(relayStatus)}></div> &nbsp; {relayStatus}
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Best Block Hash</th>
                                    <th>Best Block Height</th>
                                </tr>
                            </thead>
                            <tbody>
                                {btcBlocks.map((block, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{block.source}</td>
                                            <td>
                                                <a
                                                    href={
                                                        (constants.BTC_MAINNET
                                                            ? constants.BTC_EXPLORER_BLOCK_API
                                                            : constants.BTC_TEST_EXPLORER_BLOCK_API) + block.hash
                                                    }
                                                    target="__blank"
                                                >
                                                    {block.hash}
                                                </a>
                                            </td>
                                            <td className={getHeightColor()}>{block.height}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
