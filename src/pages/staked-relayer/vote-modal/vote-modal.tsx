import React, { ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";

type VoteModalProps = {
    onClose: ()=>void;
    show: boolean;
    parachain: any;
};

export default function VoteModal(props: VoteModalProps):ReactElement{

  return <Modal show={props.show} onHide={props.onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Vote on Status Update Proposal #{props.parachain && props.parachain.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.parachain && <React.Fragment>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">Timestamp:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">{props.parachain.timestamp}</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">Proposer:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">xdsadsxxxddssasd</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">Proposed Status:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">{props.parachain.proposedStatus}</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">Current Status:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">{props.parachain.currentStatus}</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">Proposed Changes:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">{props.parachain.proposedChanges}</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">BTC Block Hash:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">{props.parachain.hash}</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">Votes:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">{props.parachain.votes}</div>
          </div>
          </React.Fragment>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          No
        </Button>
        <Button variant="primary" type="submit">
          Yes
        </Button>
      </Modal.Footer>
  </Modal>
    
}