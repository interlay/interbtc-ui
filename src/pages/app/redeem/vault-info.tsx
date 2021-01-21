import React from "react";
import { FormGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { shortAddress } from "../../../common/utils/utils";
import { useTranslation } from 'react-i18next';

export default function VaultInfo() {
    const { t } = useTranslation();
    const { vaultDotAddress, vaultBtcAddress } = useSelector((state: StoreType) => state.redeem);

    return <React.Fragment>
        <FormGroup>
            <h5>{t("redeem_page.request_processed")}</h5>
            <p>
                {t("redeem_page.processed_by_vault")}
                <b> {shortAddress(vaultDotAddress)}</b>
            </p>
            <p>
                {t("redeem_page.will_receive_BTC")}
                <b> {vaultBtcAddress}</b>
            </p>
            <p>
                {t("redeem_page.we_will_inform_you")}
            </p>
        </FormGroup>
        <button className="btn btn-primary float-right" onClick={()=>{}}>
            {t("redeem_page.finish")}
        </button>
    </React.Fragment>
}