import React, { ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

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
  const polkaBTC = useSelector((state: StoreType) => state.api);
  const stakedRelayer = useSelector((state: StoreType) => state.relayer);

  const onSubmit = handleSubmit(async ({ btcBlock, message }) => {
    await stakedRelayer.suggestInvalidBlock(STATUS_UPDATE_DEPOSIT, btcBlock);
    props.onClose();
  });

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Report Invalid BTC Block in BTC-Relay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">BTC-Relay block header</div>
            <div className="col-12">
              <input
                name="btcBlock"
                type="text"
                className={
                  "custom-input" + (errors.btcBlock ? " error-borders" : "")
                }
                ref={register({
                  required: false,
                  pattern: {
                    value: /^[1-9a-zA-Z]{1,1}[0-9a-zA-Z]{31,31}$/,
                    message: "Please enter valid BTC header",
                  },
                })}
              ></input>
              {errors.btcBlock && (
                <div className="input-error">
                  {errors.btcBlock.type === "required"
                    ? "BTC-Relay block header is required"
                    : errors.btcBlock.message}
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12">Proof / Message</div>
            <div className="col-12">
              <textarea
                className={
                  "custom-textarea" + (errors.message ? " error-borders" : "")
                }
                name="message"
                ref={register({ required: false })}
                rows={6}
              ></textarea>
              {errors.message && (
                <div className="input-error">Message is required</div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Report
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
