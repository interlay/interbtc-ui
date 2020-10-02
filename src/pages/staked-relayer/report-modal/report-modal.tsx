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
                        <div className="col-12">Bitcoin Block Header</div>
                        <div className="col-12">
                            <input
                                name="btcBlock"
                                type="text"
                                className={"custom-input" + (errors.btcBlock ? " error-borders" : "")}
                                ref={register({
                                    required: true,
                                    pattern: {
                                        value: /^[0-9a-zA-Z]{160,160}$/,
                                        message: "Please enter valid BTC header",
                                    },
                                })}
                            ></input>
                            {errors.btcBlock && (
                                <div className="input-error">
                                    {errors.btcBlock.type === "required"
                                        ? "BTC-Relay block header is required"
                                        : errors.btcBlock.message}
                                </div>
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
