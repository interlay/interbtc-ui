import React, { ReactElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { toast } from "react-toastify";
import ButtonMaybePending from "../../../common/components/pending-button";

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
    const relayerLoaded = useSelector((state: StoreType) => state.general.relayerLoaded);
    const [isReportPending, setReportPending] = useState(false);

    const onSubmit = handleSubmit(async ({ btcBlock, message }) => {
        if (!relayerLoaded) return;
        setReportPending(true);
        try {
            await window.relayer.suggestInvalidBlock(STATUS_UPDATE_DEPOSIT, btcBlock, message);
            toast.success("Status Update Suggested");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
        setReportPending(false);
    });

    return (
        <Modal show={props.show} onHide={props.onClose} size={"lg"}>
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
                                        ? "Bitcoin block hash is required"
                                        : errors.btcBlock.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">Message</div>
                        <div className="col-12">
                            <textarea
                                className={"custom-textarea" + (errors.message ? " error-borders" : "")}
                                name="message"
                                ref={register({ required: false })}
                                rows={6}
                            ></textarea>
                            {errors.message && <div className="input-error">Message is required</div>}
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
