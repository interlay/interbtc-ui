import React, { ReactElement } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";
import { showAccountModalAction } from "../../actions/general.actions";

import "./account-modal.scss";

type AccountModalProps = {
    onSelected: (account: string) => void | Promise<void>;
    selected?: string;
}

export default function AccountModal(props: AccountModalProps): ReactElement {
    const showAccountModal = useSelector((state: StoreType) => state.general.showAccountModal);
    const accounts = useSelector((state: StoreType) => state.general.accounts);
    const extensions = useSelector((state: StoreType) => state.general.extensions);
    const dispatch = useDispatch();

    const onClose = () => dispatch(showAccountModalAction(false));

    return (
        <Modal show={showAccountModal} onHide={onClose} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {extensions.length ? "Select account" : "Pick a wallet"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="account-modal">
            {extensions.length ? 
                <React.Fragment>
                    {!accounts.length ? <div>
                        <p>
                            You don't have an account. Create one
                            <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">
                                &nbsp;here
                            </a>. Once you create a new account please refresh the page.
                        </p>
                        </div> : <p>Please select an account:</p>}
                    {(accounts || []).map((account: string, index: number) => (
                        <div className="row" key={index}>
                            <div className="col-12">
                                <div className="one-account" onClick={() => props.onSelected(account)}>
                                    {account}
                                </div>
                            </div>
                        </div>
                    ))}
                </React.Fragment>
                :
                <React.Fragment>
                    <div className="row description">
                        <div className="col-12">Please install one of the currently supported wallets</div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">
                                <div className="wallet">
                                        <img src="https://polkadot.js.org/logo.svg" width="30" height="30" alt="wallet-logo"/>
                                        <span className="name">Polkadot.js</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </React.Fragment> 
            }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
