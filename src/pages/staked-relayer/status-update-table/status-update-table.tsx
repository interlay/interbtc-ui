import React, { ReactElement, useEffect, useState } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import VoteModal from "../vote-modal/vote-modal";
import { StatusUpdate } from "../../../common/types/util.types";
import * as constants from "../../../constants";

const ADD_DATA_ERROR = "Add NO_DATA error";
const REMOVE_DATA_ERROR = "Remove NO_DATA error";

interface Option<T> {
    isNone: boolean;
    unwrap(): T;
}

interface H256Le {
    toString(): string;
}

interface ErrorCode {
    toString(): string;
}

function displayBlockHash(option: Option<H256Le>): string {
    return option.isNone ? "None" : option.unwrap().toString();
}

function displayProposedChanges(addError: Option<ErrorCode>, removeError: Option<ErrorCode>): string {
    return addError.isNone
        ? removeError.isNone
            ? "-"
            : removeError.unwrap().toString()
        : addError.unwrap().toString();
}

type StatusUpdateTableProps = {
    dotLocked: number;
};

export default function StatusUpdateTable(props: StatusUpdateTableProps): ReactElement {
    const [parachainStatus, setStatus] = useState("Running");
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const [statusUpdates, setStatusUpdates] = useState<Array<StatusUpdate>>([]);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const handleClose = () => setShowVoteModal(false);
    const [statusUpdate, setStatusUpdate] = useState<StatusUpdate>();

    useEffect(() => {
        const fetchStatus = async () => {
            if (!polkaBTC) return;

            let result = await polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();
            setStatus(result.isRunning ? "Running" : result.isError ? "Error" : "Shutdown");
        };

        const fetchUpdates = async () => {
            if (!polkaBTC) return;

            let result = await polkaBTC.stakedRelayer.getAllStatusUpdates();
            setStatusUpdates(
                result.map(
                    (status): StatusUpdate => {
                        const [id, statusUpdate] = status;
                        return {
                            id,
                            timestamp: statusUpdate.time.toString(),
                            proposedStatus: statusUpdate.new_status_code.toString(),
                            currentStatus: statusUpdate.old_status_code.toString(),
                            proposedChanges: displayProposedChanges(statusUpdate.add_error, statusUpdate.remove_error),
                            blockHash: displayBlockHash(statusUpdate.btc_block_hash),
                            votes: `${statusUpdate.tally.aye.size} : ${statusUpdate.tally.nay.size}`,
                            result: statusUpdate.proposal_status.toString(),
                            proposer: statusUpdate.proposer.toString(),
                        };
                    }
                )
            );
        };

        fetchStatus();
        fetchUpdates();
    }, [polkaBTC]);

    const openVoteModal = (statusUpdate: StatusUpdate) => {
        setShowVoteModal(true);
        setStatusUpdate(statusUpdate);
    };

    const getResultColor = (result: string): string => {
        switch (result) {
            case "Accepted":
                return "green-text";
            case "Rejected":
                return "red-text";
            default:
                return "";
        }
    };

    const getCircle = (status: string): string => {
        switch (status) {
            case "Running":
                return "green-circle";
            case "Error":
                return "yellow-circle";
            default:
                return "red-circle";
        }
    };

    const getProposedChangesColor = (changes: string): string => {
        switch (changes) {
            case ADD_DATA_ERROR:
                return "orange-text";
            case REMOVE_DATA_ERROR:
                return "green-text";
            default:
                return "red-text";
        }
    };

    const getPercentage = (votes: string, type: string): number => {
        const yes = Number(votes.split(":")[0]);
        const no = Number(votes.split(":")[1]);
        const total = yes + no;
        if (type === "yes") {
            return Number((yes / (total / 100)).toFixed(1));
        }
        return Number((no / (total / 100)).toFixed(1));
    };

    return (
        <div className="btc-parachain-table">
            <VoteModal
                show={showVoteModal}
                onClose={handleClose}
                statusUpdate={statusUpdate!}
                getColor={getProposedChangesColor}
            ></VoteModal>
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        BTC Parachain Status:&nbsp; {parachainStatus}
                        &nbsp; <div className={getCircle(parachainStatus)}></div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Parachain Block</th>
                                    <th>Proposed Status</th>
                                    <th>Current Status</th>
                                    <th>Proposed Changes</th>
                                    <th>BTC Block Hash</th>
                                    <th>Votes (Yes : No)</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statusUpdates.map((statusUpdate, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{statusUpdate.id.toString()}</td>
                                            <td>{statusUpdate.timestamp}</td>
                                            <td
                                                className={
                                                    statusUpdate.proposedStatus === "Running"
                                                        ? "green-text"
                                                        : "orange-text"
                                                }
                                            >
                                                {statusUpdate.proposedStatus}
                                            </td>
                                            <td>{statusUpdate.currentStatus}</td>
                                            <td className={getProposedChangesColor(statusUpdate.proposedChanges)}>
                                                {statusUpdate.proposedChanges}
                                            </td>
                                            <td className="break-words">
                                                <a
                                                    href={(constants.BTC_MAINNET ?
                                                        constants.BTC_EXPLORER_BLOCK_API :
                                                        constants.BTC_TEST_EXPLORER_BLOCK_API) +
                                                        statusUpdate.blockHash
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {statusUpdate.blockHash}
                                                </a>
                                            </td>
                                            <td>
                                                {" "}
                                                {statusUpdate.votes && (
                                                    <React.Fragment>
                                                        <p>
                                                            <span className="green-text">
                                                                {getPercentage(statusUpdate.votes, "yes")}%
                                                            </span>
                                                            <span>&nbsp;:&nbsp;</span>
                                                            <span className="red-text">
                                                                {getPercentage(statusUpdate.votes, "no")}%
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <span className="green-text">
                                                                {statusUpdate.votes.split(":")[0]}
                                                            </span>
                                                            <span>:</span>
                                                            <span className="red-text">
                                                                {statusUpdate.votes.split(":")[1]}
                                                            </span>
                                                        </p>
                                                    </React.Fragment>
                                                )}
                                            </td>
                                            <td className={getResultColor(statusUpdate.result)}>
                                                {props.dotLocked > 0 && statusUpdate.result === "Pending" ? (
                                                    <Button
                                                        variant="outline-primary"
                                                        onClick={() => openVoteModal(statusUpdate)}
                                                    >
                                                        Vote
                                                    </Button>
                                                ) : (
                                                    statusUpdate.result
                                                )}
                                            </td>
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
