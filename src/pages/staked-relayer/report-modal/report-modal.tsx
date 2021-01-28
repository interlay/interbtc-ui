import React, { ReactElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { toast } from "react-toastify";
import ButtonMaybePending from "../../../common/components/pending-button";
import { reverseEndiannessHex } from "@interlay/polkabtc";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const onSubmit = handleSubmit(async ({ btcBlock, message }) => {
        if (!relayerLoaded) return;
        setReportPending(true);
        try {
            const btcBlockLE = `0x${reverseEndiannessHex(btcBlock)}`;
            await window.relayer.suggestInvalidBlock(STATUS_UPDATE_DEPOSIT, btcBlockLE, message);
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
                    <Modal.Title>{t("relayer.report_invalid")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12">{t("relayer.block_hash")}</div>
                        <div className="col-12">
                            <input
                                name="btcBlock"
                                type="text"
                                className={"custom-input" + (errors.btcBlock ? " error-borders" : "")}
                                ref={register({
                                    required: true,
                                    pattern: {
                                        value: /^[0-9a-zA-Z]{64,64}$/,
                                        message: t("relayer.enter_valid_block"),
                                    },
                                })}
                            ></input>
                            {errors.btcBlock && (
                                <div className="input-error">
                                    {errors.btcBlock.type === "required"
                                        ? t("relayer.hash_is_required")
                                        : errors.btcBlock.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">{t("message")}</div>
                        <div className="col-12">
                            <textarea
                                className={"custom-textarea" + (errors.message ? " error-borders" : "")}
                                name="message"
                                ref={register({ required: false })}
                                rows={6}
                            ></textarea>
                            {errors.message && <div className="input-error">{t("relayer.requeried_message")}</div>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        {t("cancel")}
                    </Button>
                    <ButtonMaybePending variant="primary" type="submit" isPending={isReportPending}>
                        {t("report")}
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
