import React, { ReactElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { toast } from "react-toastify";
import ButtonMaybePending from "../../../common/components/staked-relayer/pending-button";

const STATUS_UPDATE_DEPOSIT = 100;

type ReportModalType = {
    onClose: () => void;
    show: boolean;
};

type ReportForm = {
    btcBlock: string;
    message: string;
};

export default function ReportModal(props: ReportModalType): ReactElement {
    const { register, handleSubmit, errors } = useForm<ReportForm>();
    const stakedRelayer = useSelector((state: StoreType) => state.relayer);
    const [isReportPending, setReportPending] = useState(false);

    const onSubmit = handleSubmit(async ({ btcBlock, message }) => {
        setReportPending(true);
        try {
            await stakedRelayer.suggestInvalidBlock(STATUS_UPDATE_DEPOSIT, btcBlock);
            toast.success("Status Update Suggested");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
        setReportPending(false);
    });

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Report Invalid BTC Block in BTC-Relay</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12">Bitcoin Block Hash</div>
                        <div className="col-12">
                            <input
                                name="btcBlock"
                                type="text"
                                className={"custom-input" + (errors.btcBlock ? " error-borders" : "")}
                                ref={register({
                                    required: true,
                                    pattern: {
                                        value: /^[0-9a-zA-Z]{64,64}$/,
                                        message: "Please enter valid BTC block hash",
                                    },
                                })}
                            ></input>
                            {errors.btcBlock && (
                                <div className="input-error">
                                    {errors.btcBlock.type === "required"
                                        ? "Please enter the hash of the block that you wish to report as invalid in BTC-Relay"
                                        : errors.btcBlock.message}
                                </div>
                            )}
                        </div>
                        <div className="col-12">Proof / Message</div>
                        <div className="col-12">
                            <textarea
                                className={
                                    "custom-textarea" + (errors.message ? " error-borders" : "")
                                }
                                name="message"
                                ref={register({ required: true })}
                                rows={6}
                            ></textarea>
                            {errors.message && (
                                <div className="input-error">Please provide a proof / message showing why/how the block is invalid.</div>
                            )}
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Cancel
                    </Button>
                    <ButtonMaybePending variant="primary" type="submit" isPending={isReportPending}>
                        Report
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
