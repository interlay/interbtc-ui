import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StoreType } from "../../../common/types/util.types";
import * as constants from "../../../constants";

interface BlockInfo {
    source: string;
    height: string;
    hash: string;
}


export default function BitcoinTable(): ReactElement {
    const [relayStatus, setStatus] = useState("Online");
    const [btcBlocks, setBlocks] = useState<Array<BlockInfo>>([]);
    const polkaBTC = useSelector((state: StoreType) => state.api);

    useEffect(() => {
        setStatus("Online");

        const fetchData = async () => {
            if (!polkaBTC) return;

            // returns a little endian encoded block hash
            const bestParachainBlock = await polkaBTC.stakedRelayer.getLatestBTCBlockFromBTCRelay();
            const bestParachainHeight = await polkaBTC.stakedRelayer.getLatestBTCBlockHeightFromBTCRelay();

            // returns a big endian encoded block hash
            // TODO: this should return in little endian
            const bestBitcoinBlock = await polkaBTC.btcCore.getLatestBlock();
            const bestBitcoinHeight = await polkaBTC.btcCore.getLatestBlockHeight();

            setBlocks([
                {
                    source: "BTC Parachain",
                    hash: bestParachainBlock.toString().substr(2).split("").reverse().join(""),
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
    }, [polkaBTC]);

    const getCircle = (status: string): string => {
        if (status === "Online") {
            return "green-circle";
        }
        if (status === "Fork") {
            return "orange-circle";
        }
        return "red-circle";
    };

    return (
        <div className="bitcoin-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        Bitcoin Relay Status:&nbsp; {relayStatus} &nbsp;
                        <div className={getCircle("Online")}></div>
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
                                            <td><a href={(constants.BTC_MAINNET ?
                                                        constants.BTC_EXPLORER_BLOCK_API :
                                                        constants.BTC_TEST_EXPLORER_BLOCK_API) +
                                                        block.hash
                                                    } target="__blank">{block.hash}</a></td>
                                            <td>{block.height}</td>
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
