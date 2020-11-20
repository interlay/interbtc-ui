import React, { ReactElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";


type WalletModalType = {
    onClose: () => void;
    show: boolean;
};


export default function WalletModal(props: WalletModalType): ReactElement {

    return (
        <Modal show={true} onHide={props.onClose} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>Pick a wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12">Bitcoin Block Hash (Big Endian)</div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
