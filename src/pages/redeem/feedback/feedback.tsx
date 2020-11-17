import React from "react";
import { Container, Modal } from "react-bootstrap";
import { FEEDBACK_URL } from "../../../constants";

export interface FeedbackProps {
    handleClose: () => void;
}

export default function Feedback(props: FeedbackProps) {
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
                <Modal.Title id="contained-modal-title-vcenter">Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Thanks for testing PolkaBTC! </p>
                <p> We want to build the best-possible solution and would like to hear your feedback!</p>
                <p>It only takes 2 minutes of your time.</p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary float-left" onClick={handleClose}>
                    Don't give feedback
                </button>

                <button className="btn btn-primary float-right" onClick={openFeedback}>
                    Give feedback
                </button>
            </Modal.Footer>
        </Container>
    );
}
