import React, { ReactElement, ChangeEvent, useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import * as constants from "../../../constants";
import { showAccountModalAction } from "../../actions/general.actions";

import "./account-modal.scss";

type AccountModalProps = {
    onSelected: (account: string) => void | Promise<void>;
    selected?: string;
}

export default function AccountModal(props: AccountModalProps): ReactElement {
    const [accountValue, setAccountValue] = useState(props.selected || "");
    const showAccountModal = useSelector((state: StoreType) => state.general.showAccountModal);
    const [accounts, setAccounts] = useState<string[]>([]);
    const extensions = useSelector((state: StoreType) => state.general.extensions);
    const dispatch = useDispatch();

    const onClose = () => dispatch(showAccountModalAction(false));

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                await web3Enable(constants.APP_NAME);

                const allAccounts = await web3Accounts();
                if (allAccounts.length === 0) return;
                setAccounts(allAccounts.map((acc) => acc.address));
            }
            catch (error) {
                console.log(error);
            }
        };

        fetchAccounts();
    },[]);

    return (
        <Modal show={showAccountModal} onHide={onClose} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {extensions.length ? "Select account" : "Pick a wallet"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="wallet-picker-modal">
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
                    {(accounts || []).map((account: string) => (
                        <Form.Check
                            type="radio"
                            name="account"
                            key={account}
                            label={account}
                            value={account}
                            checked={accountValue === account}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setAccountValue(e.currentTarget.value)}
                        />
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
                {extensions.length && accounts.length ?
                    <Button className="btn btn-primary float-right" onClick={() => props.onSelected(accountValue)}>
                        Select account
                    </Button>
                    :
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    );
}
