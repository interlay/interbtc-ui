import React, { ReactElement } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector, useStore } from "react-redux";
import { StoreType } from "../../types/util.types";
import { showAccountModalAction } from "../../actions/general.actions";
import { useTranslation } from "react-i18next";
import fetchIssueTransactions from "../../live-data/issue-transaction.watcher";

import "./account-modal.scss";

type AccountModalProps = {
    onSelected: (account: string) => void | Promise<void>;
    selected?: string;
};

export default function AccountModal(props: AccountModalProps): ReactElement {
    const { showAccountModal, accounts, extensions } = useSelector((state: StoreType) => state.general);
    const store = useStore();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onClose = () => dispatch(showAccountModalAction(false));

    return (
        <Modal show={showAccountModal} onHide={onClose} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <p id="account-modal-title">{extensions.length ? "Select account" : "Pick a wallet"}</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="account-modal">
                {extensions.length ? (
                    <React.Fragment>
                        {!accounts.length && (
                            <div id="account-modal-no-account">
                                <p>
                                    {t("no_account")}
                                    <a
                                        href="https://polkadot.js.org/extension/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        &nbsp;{t("here")}
                                    </a>
                                    . {t("refresh_page")}
                                </p>
                            </div>
                        )}
                        {(accounts || []).map((account: string, index: number) => (
                            <div className="row" key={index}>
                                <div className="col-12">
                                    <div
                                        className="one-account"
                                        onClick={() => {
                                            props.onSelected(account);
                                            fetchIssueTransactions(dispatch, store);
                                        }}
                                    >
                                        {account}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className="row description">
                            <div className="col-12">{t("install_supported_wallets")}</div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">
                                    <div className="wallet">
                                        <img
                                            src="https://polkadot.js.org/logo.svg"
                                            width="30"
                                            height="30"
                                            alt="wallet-logo"
                                        />
                                        <span className="name">Polkadot.js</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
