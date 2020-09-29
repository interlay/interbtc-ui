import React, { ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

type ReportModalType = {
    onClose: ()=>void;
    show: boolean;
};

type ReportForm = {
  btcBlock: string;
  message: string;
}

export default function ReportModal(props: ReportModalType):ReactElement{
  const {register,handleSubmit} = useForm<ReportForm>();

  const onSubmit = handleSubmit(({btcBlock,message})=>{
    console.log(btcBlock,message);
    props.onClose();
  });

  return <Modal show={props.show} onHide={props.onClose}>
    <form onSubmit={onSubmit}>
      <Modal.Header closeButton>
        <Modal.Title>Report Invalid BTC Block in BTC-Relay</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12">
            BTC-Relay block header
          </div>
          <div className="col-12">
            <input type="text" className="custom-input" name="btcBlock" ref={register({required: true})}></input>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            Proof / Message
          </div>
          <div className="col-12">
            <textarea className="custom-textarea" name="message" ref={register({required: true})} rows={6}></textarea>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Modal.Footer>
    </form>
  </Modal>
    
}