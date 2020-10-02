import React, { ReactElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { toast } from "react-toastify";
import { StatusUpdate } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/staked-relayer/pending-button";

type VoteModalProps = {
    onClose: () => void;
    show: boolean;
    statusUpdate: StatusUpdate;
    getColor: (changes: string) => string;
};

export default function VoteModal(props: VoteModalProps): ReactElement {
    const stakedRelayer = useSelector((state: StoreType) => state.relayer);
    const [isVotePending, setVotePending] = useState(false);

    const onClick = async (vote: string) => {
        setVotePending(true);
        try {
            await stakedRelayer.voteOnStatusUpdate(props.statusUpdate.id, vote === "yes");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
        setVotePending(false);
    };

    return (
        <Modal show={props.show} onHide={props.onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Vote on Status Update Proposal #{props.statusUpdate && props.statusUpdate.id.toString()}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.statusUpdate && (
                    <React.Fragment>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Timestamp:</div>
                            <div className="col-xl-9 col-lg-8 col-md-6">{props.statusUpdate.timestamp}</div>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Proposer:</div>
                            <div className="col-xl-9 col-lg-8 col-md-6">{props.statusUpdate.proposer}</div>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Proposed Status:</div>
                            <div className="col-xl-9 col-lg-8 col-md-6">
                                <span
                                    className={
                                        props.statusUpdate.proposedStatus === "Running" ? " green-text" : " orange-text"
                                    }
                                >
                                    {props.statusUpdate.proposedStatus}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Current Status:</div>
                            <div className="col-xl-9 col-lg-8 col-md-6">
                                <span
                                    className={
                                        props.statusUpdate.currentStatus === "Running" ? " green-text" : " orange-text"
                                    }
                                >
                                    {props.statusUpdate.currentStatus}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Proposed Changes:</div>
                            <div className="col-xl-9 col-lg-8 col-md-6">
                                <span className={props.getColor(props.statusUpdate.proposedChanges)}>
                                    {props.statusUpdate.proposedChanges}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">BTC Block Hash:</div>
                            <div className="col-xl-9 col-lg-8 col-md-6">{props.statusUpdate.blockHash}</div>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Votes (Yes : No):</div>
                            <div className="col-xl-9 col-lg-8 col-md-6">
                                <span className="green-text">{props.statusUpdate.votes.split(":")[0]}</span>
                                <span className="red-text">{" : " + props.statusUpdate.votes.split(":")[1]}</span>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </Modal.Body>
            <Modal.Footer>
                <ButtonMaybePending
                    type="submit"
                    variant="outline-danger"
                    isPending={isVotePending}
                    onClick={() => onClick("no")}
                >
                    No
                </ButtonMaybePending>
                <ButtonMaybePending variant="outline-success" isPending={isVotePending} onClick={() => onClick("yes")}>
                    Yes
                </ButtonMaybePending>
            </Modal.Footer>
        </Modal>
    );
}
