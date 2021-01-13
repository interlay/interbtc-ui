import React from "react";
import { Container, Modal } from "react-bootstrap";
import { FEEDBACK_URL } from "../../../constants";
import { useTranslation } from 'react-i18next';


export interface FeedbackProps {
    handleClose: () => void;
}

export default function Feedback(props: FeedbackProps) {
    const { t } = useTranslation();


    const handleClose = () => {
        props.handleClose();
    };

    const openFeedback = () => {
        window.open(FEEDBACK_URL, "_blank");
        handleClose();
    };

    return (
        <Container>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{t("feedback.feedback")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{t("feedback.thanks_for_testing")} </p>
                <p>{t("feedback.would_like_to_hear")}</p>
                <p>{t("feedback.two_mins")}</p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary float-left" onClick={handleClose}>
                    {t("feedback.no_feedback")}
                </button>

                <button className="btn btn-primary float-right" onClick={openFeedback}>
                    {t("feedback.give_feedback")}
                </button>
            </Modal.Footer>
        </Container>
    );
}
