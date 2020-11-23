import React, { ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";
import { showWalletPickerModalAction } from "../../actions/general.actions";


import "./wallet-picker-modal.scss";

export default function WalletPickerModal(): ReactElement {
    const showWalletPickerModal = useSelector((state: StoreType) => state.general.showWalletPickerModal);
    const dispatch = useDispatch();

    const onClose = () => dispatch(showWalletPickerModalAction(false));

    return (
        <Modal show={showWalletPickerModal} onHide={onClose} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>Pick a wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body className="wallet-picker-modal">
                <div className="row description">
                    <div className="col-12">Please install one of supported wallets</div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <a href="https://polkadot.js.org/" target="_blank" rel="noopener noreferrer">
                            <div className="wallet">
                                    <img src="https://polkadot.js.org/logo.svg" width="30" height="30" alt="wallet-logo"/>
                                    <span className="name">Polkadot.js</span>
                            </div>
                        </a>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
