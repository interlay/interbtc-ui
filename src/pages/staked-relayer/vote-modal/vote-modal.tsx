import React, { ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

type VoteModalProps = {
    onClose: ()=>void;
    show: boolean;
    parachain: any;
    getColor: (changes:string)=>string;
};

export default function VoteModal(props: VoteModalProps):ReactElement{
  const stakedRelayer = useSelector((state: StoreType) => state.relayer);

  const onClick = async (vote: string) => {
    try {
      const result = await stakedRelayer.voteOnStatusUpdate(props.parachain.id,vote==="yes");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    props.onClose();
  };

  return <Modal show={props.show} onHide={props.onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Vote on Status Update Proposal #{props.parachain && props.parachain.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.parachain && <React.Fragment>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Timestamp:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">{props.parachain.timestamp}</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Proposer:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">xdsadsxxxddssasd</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Proposed Status:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">
            <span className={props.parachain.proposedStatus === "Running" ? " green-text" : " orange-text"}>
              {props.parachain.proposedStatus}
            </span>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Current Status:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">
              <span className={props.parachain.currentStatus === "Running" ? " green-text" : " orange-text"}>
                {props.parachain.currentStatus}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Proposed Changes:</div>
          <div className="col-xl-9 col-lg-8 col-md-6"> 
            <span className={props.getColor(props.parachain.proposedChanges)}>
              {props.parachain.proposedChanges}
            </span>
          </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">BTC Block Hash:</div>
            <div className="col-xl-9 col-lg-8 col-md-6">{props.parachain.hash}</div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 vote-label">Votes (Yes : No):</div>
            <div className="col-xl-9 col-lg-8 col-md-6">
              <span className="green-text">{props.parachain.votes.split(":")[0]}</span>
              <span className="red-text">{ " : " + props.parachain.votes.split(":")[1] }</span>
            </div>
          </div>
          </React.Fragment>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" type="submit" onClick={()=>onClick("no")}>
          No
        </Button>
        <Button variant="outline-success" onClick={()=>onClick("yes")}>
          Yes
        </Button>
      </Modal.Footer>
  </Modal>
    
}