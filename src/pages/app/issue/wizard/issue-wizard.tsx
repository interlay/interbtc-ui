import React from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../../../common/types/util.types";
import { Modal } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { shortAddress } from "../../../../common/utils/utils";
import Big from "big.js";

type IssueWizardProps = {
    show: boolean;
    onClose: () => void;
}

export default function IssueWizard(props: IssueWizardProps) {
    const { address } = useSelector((state: StoreType) => state.general);
    const selectedIdRequest = useSelector((state: StoreType) => state.issue.id);
    const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];
    const request = issueRequests.filter((request) => request.id === selectedIdRequest)[0];
    const { t } = useTranslation();
    const fee = new Big(request.fee);
    const amount = new Big(request.amountBTC);
    const total = amount.add(fee);

    return <Modal show={props.show} onHide={props.onClose} size={"xl"}>
        <Modal.Body>
            {request &&
                <div className="row">
                    <div className="col-6">
                        <div className="wizard-title">
                            {t("issue_page.issue_request_for")}
                        </div>
                        <div className="wizard-amount"><span>{request.amountBTC}</span> polkaBTC</div>
                        <div className="wizard-item row">
                            <div className="col-6">{t("issue_page.issue_id")}</div>
                            <div className="col-6">{shortAddress(request.id)}</div>
                        </div>
                        <div className="wizard-item">
                            <div className="col-6">{t("issue_page.parachain_block")}</div>
                            <div className="col-6">{request.id}</div>
                        </div>
                        <div className="wizard-item">
                            <div className="col-6">{t("nav_vault")}</div>
                            <div className="col-6">{request.vaultBTCAddress}</div>
                        </div>
                        <div className="wizard-item">
                            <div className="col-6">{t("issue_page.vault_btc_address")}</div>
                            <div className="col-6">{request.vaultDOTAddress}</div>
                        </div>
                        <div className="wizard-item">
                            <div className="col-6">{t("bridge_fee")}</div>
                            <div className="col-6">{request.fee}</div>
                        </div>
                        <div className="wizard-item">
                            <div className="col-6">{t("total_deposit")}</div>
                            <div className="col-6">{total.toString()}</div>
                        </div>
                    </div>
                    <div className="col-6">

                    </div>
                </div>
            }
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
    </Modal>
}
